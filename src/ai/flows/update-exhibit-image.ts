'use server';
/**
 * @fileOverview This file defines a Genkit flow for updating an exhibit's metadata based on a new image.
 *
 * The flow compares a new image with the existing metadata of an exhibit item. It determines
 * if the new image provides additional, relevant information and, if so, returns updated metadata.
 *
 * @exports updateExhibitImage - The main function to trigger the update analysis flow.
 * @exports UpdateExhibitImageInput - The input type for the updateExhibitImage function.
 * @exports UpdateExhibitImageOutput - The output type for the updateExhibitImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ExhibitMetadata } from '@/lib/types';

const UpdateExhibitImageInputSchema = z.object({
  newPhotoDataUri: z
    .string()
    .describe(
      'A new photo of the museum exhibit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  existingMetadata: z.custom<ExhibitMetadata>().describe('The existing metadata of the exhibit item.'),
});
export type UpdateExhibitImageInput = z.infer<typeof UpdateExhibitImageInputSchema>;

const UpdateExhibitImageOutputSchema = z.object({
  newInfoFound: z.boolean().describe('Whether the new image provided new, relevant, and related information.'),
  updatedMetadata: z.custom<ExhibitMetadata>().optional().describe('The updated metadata, including both old and new information. Only present if newInfoFound is true.'),
  reasoning: z.string().describe('A brief explanation of why the information was or was not considered new and relevant.'),
});
export type UpdateExhibitImageOutput = z.infer<typeof UpdateExhibitImageOutputSchema>;

export async function updateExhibitImage(input: UpdateExhibitImageInput): Promise<UpdateExhibitImageOutput> {
  return updateExhibitImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updateExhibitImagePrompt',
  input: {schema: UpdateExhibitImageInputSchema},
  output: {schema: UpdateExhibitImageOutputSchema},
  prompt: `You are an AI expert in analyzing museum artifacts. Your task is to compare a new photo with the existing metadata of an item and determine if the new photo provides any new, relevant, or related information.

**Analysis Criteria:**
1.  **Relevance:** The new photo must clearly be of the same artifact.
2.  **Novelty:** The photo must reveal new details not captured in the existing metadata (e.g., a different angle showing a maker's mark, a clearer view of a texture, a previously unseen detail).
3.  **Significance:** The new information should be meaningful for understanding the artifact. A slightly different lighting condition is not new information. A new angle showing a hidden crack or inscription is.

**Existing Metadata:**
\`\`\`json
{{{jsonStringify existingMetadata}}}
\`\`\`

**New Photo to Analyze:**
{{media url=newPhotoDataUri}}

**Your Task:**
1.  Analyze the new photo in the context of the existing metadata.
2.  Set \`newInfoFound\` to \`true\` if the new photo meets the criteria above. Otherwise, set it to \`false\`.
3.  Provide a brief \`reasoning\` for your decision.
4.  If \`newInfoFound\` is \`true\`, provide the \`updatedMetadata\`. This should be a complete metadata object, merging the existing data with the newly discovered information. Do not remove existing fields unless the new photo proves them incorrect. If a field is updated, the new value should be reflected. If new fields are discovered, they should be added.
5.  If \`newInfoFound\` is \`false\`, you must not return the \`updatedMetadata\` field.`,
});

const updateExhibitImageFlow = ai.defineFlow(
  {
    name: 'updateExhibitImageFlow',
    inputSchema: UpdateExhibitImageInputSchema,
    outputSchema: UpdateExhibitImageOutputSchema,
  },
  async (input) => {
    // Genkit/Handlebars doesn't have a built-in JSON stringify helper, so we do it here.
    const { output } = await prompt({
        ...input,
        // @ts-ignore - a little hack to pass a stringified version to the prompt
        jsonStringify: (obj: any) => JSON.stringify(obj, null, 2),
    });
    return output!;
  }
);
