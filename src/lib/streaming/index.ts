import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export interface StreamConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
}

export interface StreamResponse {
  content: string;
  error?: string;
}

export class StreamManager {
  private activeStreams: Map<string, AbortController>;

  constructor() {
    this.activeStreams = new Map();
  }

  startStream(id: string): AbortController {
    this.stopStream(id);
    const controller = new AbortController();
    this.activeStreams.set(id, controller);
    return controller;
  }

  stopStream(id: string) {
    const controller = this.activeStreams.get(id);
    if (controller) {
      controller.abort();
      this.activeStreams.delete(id);
    }
  }
}

export const streamManager = new StreamManager();
