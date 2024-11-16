import { createParser } from 'eventsource-parser';
import { StreamingRateLimit } from '../utils/streamingRateLimit';
import { ResponseHandler } from '../utils/responseHandler';

interface ChatApiConfig {
  apiKey: string;
  apiUrl: string;
}

export class ChatAPI {
  private rateLimit: StreamingRateLimit;
  private responseHandler: ResponseHandler;
  private config: ChatApiConfig;

  constructor(config: ChatApiConfig) {
    this.config = config;
    this.rateLimit = new StreamingRateLimit();
    this.responseHandler = new ResponseHandler();
  }

  async sendMessage(message: string, chatId: string, signal: AbortSignal) {
    console.log('ChatAPI: Starting sendMessage', { message, chatId });
    
    if (!this.rateLimit.checkRateLimit()) {
      console.error('ChatAPI: Rate limit exceeded');
      throw new Error('Rate limit exceeded');
    }

    const requestBody = {
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      stream: true,
      temperature: 0.7,
      max_tokens: 4000,
    };

    console.log('ChatAPI: Sending request with body:', requestBody);

    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
      signal,
    });

    console.log('ChatAPI: Received response status:', response.status);

    if (!response.ok) {
      console.error('ChatAPI: Request failed', response.statusText);
      throw new Error(`API request failed: ${response.statusText}`);
    }

    if (!response.body) {
      console.error('ChatAPI: Response body is null');
      throw new Error('Response body is null');
    }

    console.log('ChatAPI: Successfully received streaming response');
    return response;
  }
} 