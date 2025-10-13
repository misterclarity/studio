'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing museum exhibit images and extracting metadata.
 *
 * The flow takes an image of an exhibit as input and uses AI to extract relevant metadata
 * such as item size, production period, materials, and historical context.
 *
 * @exports analyzeExhibitImage - The main function to trigger the analysis flow.
 * @exports AnalyzeExhibitImageInput - The input type for the analyzeExhibitImage function.
 * @exports AnalyzeExhibitImageOutput - The output type for the analyzeExhibitImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeExhibitImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a museum exhibit, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'  
    ),
  description: z.string().optional().describe('Optional additional description of the exhibit.'),
});
export type AnalyzeExhibitImageInput = z.infer<typeof AnalyzeExhibitImageInputSchema>;

const AnalyzeExhibitImageOutputSchema = z.object({
  metadata: z.object({
    name: z.string().optional().describe('A suitable name for the exhibit item.'),
    description: z.string().optional().describe('A brief, one-paragraph description of the exhibit item.'),
    size: z.string().optional().describe('The estimated size of the exhibit item.'),
    productionPeriod: z.string().optional().describe('The production period of the exhibit item.'),
    productionCompany: z.string().optional().describe('The company that produced the exhibit item.'),
    materials: z.string().optional().describe('The materials used to create the exhibit item.'),
    colors: z.string().optional().describe('The colors of the exhibit item.'),
    weight: z.string().optional().describe('The estimated weight of the exhibit item.'),
    suggestedCollection: z.string().optional().describe('Suggested collection for the exhibit item.'),
    archivingMedium: z.string().optional().describe('The suggested archiving medium for the exhibit item.'),
    topic: z.string().optional().describe('The topic of the exhibit item.'),
    historicalContext: z.string().optional().describe('The historical context of the exhibit item.'),
  }).describe('Extracted metadata of the exhibit item.'),
});
export type AnalyzeExhibitImageOutput = z.infer<typeof AnalyzeExhibitImageOutputSchema>;

export async function analyzeExhibitImage(input: AnalyzeExhibitImageInput): Promise<AnalyzeExhibitImageOutput> {
  return analyzeExhibitImageFlow(input);
}

const analyzeExhibitImagePrompt = ai.definePrompt({
  name: 'analyzeExhibitImagePrompt',
  input: {schema: AnalyzeExhibitImageInputSchema},
  output: {schema: AnalyzeExhibitImageOutputSchema},
  prompt: `You are an AI expert in analyzing museum exhibits. Generate a suitable name and a brief description for the item. Also, extract all available metadata from the provided image and description.

    Description: {{{description}}}
    Photo: {{media url=photoDataUri}}

    Analyze the exhibit item and extract the following metadata:
    - name: Generate a suitable name for the item if not obvious.
    - description: Generate a brief, one-paragraph description of the item.
    - size: Estimate the size of the item if not explicitly known.
    - productionPeriod: The period when the item was produced.
    - productionCompany: The company that produced the item.
    - materials: Materials used to create the item.
    - colors: Colors of the item.
    - weight: Estimate the weight of the item if not explicitly known.
    - suggestedCollection: Suggested collection for the item.
    - archivingMedium: Suggested archiving medium for the item.
    - topic: Topic of the item.
    - historicalContext: Historical context of the item.

    Return the metadata in JSON format.
    Ensure that the string for each metadata field is clean and does not include trailing punctuation (like commas or periods) unless it is grammatically part of the value itself (e.g., at the end of a full sentence in a description).
`,
});

const analyzeExhibitImageFlow = ai.defineFlow(
  {
    name: 'analyzeExhibitImageFlow',
    inputSchema: AnalyzeExhibitImageInputSchema,
    outputSchema: AnalyzeExhibitImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeExhibitImagePrompt(input);
    return output!;
  }
);
