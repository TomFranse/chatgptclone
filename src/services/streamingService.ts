import { StreamConfig } from "@/types/chat";

export class StreamingService {
  private activeStreams: Map<string, AbortController>;

  constructor() {
    this.activeStreams = new Map();
  }

  startStream(chatId: string): AbortController {
    this.stopStream(chatId);
    const controller = new AbortController();
    this.activeStreams.set(chatId, controller);
    return controller;
  }

  stopStream(chatId: string) {
    const controller = this.activeStreams.get(chatId);
    if (controller) {
      controller.abort();
      this.activeStreams.delete(chatId);
    }
  }

  async handleStream(response: Response, onChunk: (content: string) => void): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              onChunk(data.content);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const streamingService = new StreamingService();