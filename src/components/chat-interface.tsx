'use client';

import React, { type FormEvent } from 'react';
import type { Character, Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger, useSidebar } from './ui/sidebar';

interface ChatInterfaceProps {
  character: Character;
  messages: Message[];
  isLoading: boolean;
  userInput: string;
  onUserInput: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ChatInterface({
  character,
  messages,
  isLoading,
  userInput,
  onUserInput,
  onSubmit,
}: ChatInterfaceProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { isMobile } = useSidebar();

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-4">
        {isMobile && <SidebarTrigger />}
        <Avatar className="h-10 w-10">
          <AvatarImage src={character.avatar} alt={character.name} data-ai-hint="avatar portrait" />
          <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{character.name}</h2>
          <p className="text-sm text-muted-foreground">{character.description}</p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-3',
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 shrink-0">
                     <AvatarImage src={character.avatar} alt={character.name} data-ai-hint="avatar portrait" />
                    <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 text-sm md:max-w-md lg:max-w-lg animate-in fade-in',
                    message.sender === 'user'
                      ? 'rounded-br-none bg-primary text-primary-foreground'
                      : 'rounded-bl-none bg-card'
                  )}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-3 flex-row">
                 <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={character.avatar} alt={character.name} data-ai-hint="avatar portrait" />
                  <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="rounded-bl-none rounded-lg bg-card p-3">
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            )}
             <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <footer className="border-t bg-card p-4">
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Input
            autoComplete="off"
            name="message"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => onUserInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-accent/50 focus-visible:ring-primary"
          />
          <Button type="submit" size="icon" disabled={isLoading || !userInput.trim()}>
            <SendHorizontal />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
