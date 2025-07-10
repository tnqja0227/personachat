'use client';

import { useState, type FormEvent } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
} from '@/components/ui/sidebar';
import { CharacterSelection } from '@/components/character-selection';
import { ChatInterface } from '@/components/chat-interface';
import { characters } from '@/lib/characters';
import type { Character, Message } from '@/lib/types';
import { getAiResponse } from './actions';
import { Bot } from 'lucide-react';

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setMessages([]); // Reset chat when character changes
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || !selectedCharacter) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await getAiResponse(
        selectedCharacter,
        userInput,
        [...messages, userMessage]
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <CharacterSelection
            characters={characters}
            selectedCharacterId={selectedCharacter?.id || null}
            onSelectCharacter={handleSelectCharacter}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        {selectedCharacter ? (
          <ChatInterface
            character={selectedCharacter}
            messages={messages}
            isLoading={isLoading}
            userInput={userInput}
            onUserInput={setUserInput}
            onSubmit={handleSubmit}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-background p-8 text-center">
            <div className="rounded-full border border-dashed p-4">
              <Bot size={48} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-headline">Welcome to PersonaChat</h1>
            <p className="max-w-md text-muted-foreground">
              Select a character from the sidebar to start a conversation. Each
              character has a unique personality and backstory that shapes their
              responses.
            </p>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
