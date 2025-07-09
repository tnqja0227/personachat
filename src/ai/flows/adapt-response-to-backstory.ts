'use server';
/**
 * @fileOverview AI character's responses that adapt based on their backstory.
 *
 * - adaptResponseToBackstory - A function that generates responses based on the character's backstory.
 * - AdaptResponseToBackstoryInput - The input type for the adaptResponseToBackstory function.
 * - AdaptResponseToBackstoryOutput - The return type for the adaptResponseToBackstory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptResponseToBackstoryInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  characterBackstory: z.string().describe('The backstory of the character.'),
  characterName: z.string().describe('The name of the character.'),
});
export type AdaptResponseToBackstoryInput = z.infer<
  typeof AdaptResponseToBackstoryInputSchema
>;

const AdaptResponseToBackstoryOutputSchema = z.object({
  response: z.string().describe('The AI character response.'),
});
export type AdaptResponseToBackstoryOutput = z.infer<
  typeof AdaptResponseToBackstoryOutputSchema
>;

export async function adaptResponseToBackstory(
  input: AdaptResponseToBackstoryInput
): Promise<AdaptResponseToBackstoryOutput> {
  return adaptResponseToBackstoryFlow(input);
}

const adaptResponseToBackstoryPrompt = ai.definePrompt({
  name: 'adaptResponseToBackstoryPrompt',
  input: {schema: AdaptResponseToBackstoryInputSchema},
  output: {schema: AdaptResponseToBackstoryOutputSchema},
  prompt: `You are {{characterName}}, and your backstory is as follows: {{characterBackstory}}.

  A user has sent you the following message: {{message}}

  Respond in a way that is consistent with your backstory, sometimes ignoring or incorporating details based on what you would actually do. Your response should be natural.
  `,
});

const adaptResponseToBackstoryFlow = ai.defineFlow(
  {
    name: 'adaptResponseToBackstoryFlow',
    inputSchema: AdaptResponseToBackstoryInputSchema,
    outputSchema: AdaptResponseToBackstoryOutputSchema,
  },
  async input => {
    const {output} = await adaptResponseToBackstoryPrompt(input);
    return output!;
  }
);
