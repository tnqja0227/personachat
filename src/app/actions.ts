'use server';

import { generateCharacterResponse } from '@/ai/flows/generate-character-response';
import type { Message } from '@/lib/types';

export async function getAiResponse(
  characterDescription: string,
  userMessage: string,
  chatHistory: Message[]
): Promise<string> {
  try {
    const historyString = chatHistory
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join('\n');
      
    const result = await generateCharacterResponse({
      characterDescription,
      userMessage,
      chatHistory: historyString,
    });
    return result.response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}
