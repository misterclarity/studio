'use server';
/**
 * @fileOverview An AI agent for chatting about the cultural, historical, and technological context of a museum exhibit item.
 *
 * - chatAboutExhibitContext - A function that handles the conversation about an exhibit item.
 * - ChatAboutExhibitContextInput - The input type for the chatAboutExhibitContext function.
 * - ChatAboutExhibitContextOutput - The return type for the chatAboutExhibitContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatAboutExhibitContextInputSchema = z.object({
  itemDescription: z.string().describe('A detailed description of the museum exhibit item, including its properties and metadata.'),
  userQuery: z.string().describe('The user’s question about the cultural, historical, or technological context of the item.'),
});
export type ChatAboutExhibitContextInput = z.infer<typeof ChatAboutExhibitContextInputSchema>;

const ChatAboutExhibitContextOutputSchema = z.object({
  answer: z.string().describe('The AI’s answer to the user’s question, providing cultural, historical, or technological context about the item.'),
});
export type ChatAboutExhibitContextOutput = z.infer<typeof ChatAboutExhibitContextOutputSchema>;

export async function chatAboutExhibitContext(input: ChatAboutExhibitContextInput): Promise<ChatAboutExhibitContextOutput> {
  return chatAboutExhibitContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatAboutExhibitContextPrompt',
  input: {schema: ChatAboutExhibitContextInputSchema},
  output: {schema: ChatAboutExhibitContextOutputSchema},
  prompt: `You are an AI assistant that provides cultural, historical, and technological context about museum exhibit items.

  You have access to a detailed description of the item and the user's question. Use this information to provide a comprehensive and informative answer.

  Item Description: {{{itemDescription}}}
  User Question: {{{userQuery}}}

  Answer:`,
});

const chatAboutExhibitContextFlow = ai.defineFlow(
  {
    name: 'chatAboutExhibitContextFlow',
    inputSchema: ChatAboutExhibitContextInputSchema,
    outputSchema: ChatAboutExhibitContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
