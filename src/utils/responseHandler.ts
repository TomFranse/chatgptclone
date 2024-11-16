import { createParser } from 'eventsource-parser';

export class ResponseHandler {
  private decoder = new TextDecoder();

  async handleStreamedResponse(
    response: Response, 
    onChunk: (chunk: string) => void,
    onComplete: (fullText: string) => void
  ) {
    console.log('ResponseHandler: Starting to handle streamed response');
    
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('ResponseHandler: Response body is not readable');
      throw new Error('Response body is not readable');
    }

    let fullText = '';
    const parser = createParser({
      onEvent: (event) => {
        try {
          console.log('ResponseHandler: Received event:', {
            id: event.id,
            event: event.event,
            data: event.data
          });

          if (event.data === '[DONE]') {
            console.log('ResponseHandler: Stream completed with full text:', fullText);
            onComplete(fullText);
            return;
          }

          try {
            const parsed = JSON.parse(event.data);
            console.log('ResponseHandler: Parsed data:', parsed);

            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              console.log('ResponseHandler: Received content chunk:', content);
              fullText += content;
              onChunk(content);
            }
          } catch (parseError) {
            console.error('ResponseHandler: JSON parse error:', parseError);
            console.log('ResponseHandler: Problem data:', event.data);
          }
        } catch (e) {
          console.error('ResponseHandler: Event handling error:', e);
        }
      }
    });

    console.log('ResponseHandler: Starting to read stream');
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('ResponseHandler: Stream reading complete');
          break;
        }

        const chunk = this.decoder.decode(value);
        console.log('ResponseHandler: Raw chunk received:', chunk);
        
        // Split the chunk into lines and log each line
        const lines = chunk.split('\n');
        lines.forEach((line, index) => {
          if (line.trim()) {
            console.log(`ResponseHandler: Processing line ${index}:`, line);
          }
        });

        parser.feed(chunk);
      }
    } catch (error) {
      console.error('ResponseHandler: Stream reading error:', error);
      throw error;
    } finally {
      console.log('ResponseHandler: Releasing reader lock');
      reader.releaseLock();
    }

    return fullText;
  }

  async storeResponse(chatId: string, response: string) {
    try {
      // Implementation for storing in database
      await this.saveToDatabase(chatId, response);
      return true;
    } catch (error) {
      console.error('Failed to store response:', error);
      // Store in localStorage as backup
      localStorage.setItem(`failed_response_${chatId}`, response);
      return false;
    }
  }

  private async saveToDatabase(chatId: string, response: string) {
    // Implement your database storage logic here
    throw new Error('Database storage not implemented');
  }
} 