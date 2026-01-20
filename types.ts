
export enum ChatMode {
  PRO = 'PRO',
  FAST = 'FAST'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  mode: ChatMode;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastModified: Date;
}
