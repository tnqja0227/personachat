import type { Character } from '@/lib/types';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CharacterSelectionProps {
  characters: Character[];
  selectedCharacterId: string | null;
  onSelectCharacter: (character: Character) => void;
}

export function CharacterSelection({
  characters,
  selectedCharacterId,
  onSelectCharacter,
}: CharacterSelectionProps) {
  return (
    <>
      <SidebarHeader>
        <h2 className="text-xl font-semibold font-headline text-sidebar-foreground">PersonaChat</h2>
      </SidebarHeader>
      <SidebarMenu>
        {characters.map((character) => (
          <SidebarMenuItem key={character.id}>
            <SidebarMenuButton
              onClick={() => onSelectCharacter(character)}
              isActive={selectedCharacterId === character.id}
              className="h-auto justify-start py-3"
            >
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage src={character.avatar} alt={character.name} data-ai-hint="avatar portrait" />
                <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left">
                <span className="font-semibold">{character.name}</span>
                <span className="text-xs text-sidebar-foreground/70">
                  {character.description}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
