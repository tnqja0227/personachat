'use server';

/**
 * @fileOverview A flow to generate responses based on the selected character's personality and background.
 *
 * - generateCharacterResponse - A function that generates a character response.
 * - GenerateCharacterResponseInput - The input type for the generateCharacterResponse function.
 * - GenerateCharacterResponseOutput - The return type for the generateCharacterResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCharacterResponseInputSchema = z.object({
  characterName: z.string().describe("The character's name."),
  characterBackstory: z.string().describe("The character's backstory and personality."),
  userMessage: z.string().describe('The message from the user to the character.'),
  chatHistory: z.string().describe('The chat history between the user and the character.'),
});

export type GenerateCharacterResponseInput = z.infer<typeof GenerateCharacterResponseInputSchema>;

const GenerateCharacterResponseOutputSchema = z.object({
  response: z.string().describe('The response from the character to the user message.'),
});

export type GenerateCharacterResponseOutput = z.infer<typeof GenerateCharacterResponseOutputSchema>;

export async function generateCharacterResponse(input: GenerateCharacterResponseInput): Promise<GenerateCharacterResponseOutput> {
  return generateCharacterResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCharacterResponsePrompt',
  input: {schema: GenerateCharacterResponseInputSchema},
  output: {schema: GenerateCharacterResponseOutputSchema},
  prompt: `You are {{characterName}}. Your backstory is: {{characterBackstory}}.

  The user has sent the following message: {{userMessage}}
  Here's the recent chat history: {{chatHistory}}

  Generate a response to the user message as the character. Limit the response to 200 characters.
  Do not mention you are an AI or chatbot.  Do not thank the user.
  Behave as the character would.  Do not use any information outside of what you know as the character.
  Response:
  `,
});

const generateCharacterResponseFlow = ai.defineFlow(
  {
    name: 'generateCharacterResponseFlow',
    inputSchema: GenerateCharacterResponseInputSchema,
    outputSchema: GenerateCharacterResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
