export interface Character {
  id: string;
  name: string;
  avatar: string;
  description: string;
  backstory: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}
