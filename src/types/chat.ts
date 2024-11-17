import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export interface ChatMessage {
  text: string;
  createdAt: any;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export interface StreamConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
}

export interface StreamResponse {
  content: string;
  error?: string;
}