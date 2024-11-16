import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useStreamManager } from '../hooks/useStreamManager';
import { ChatAPI } from '../api/chatApi';
import { ResponseHandler } from '../utils/responseHandler';

interface StreamingChatProps {
  chatId: string;
  initialContent: string;
  apiConfig: {
    apiKey: string;
    apiUrl: string;
  };
}

export const StreamingChat = React.memo(({ chatId, initialContent, apiConfig }: StreamingChatProps) => {
  const [content, setContent] = useState(initialContent);
  const [isStreaming, setIsStreaming] = useState(false);
  const { startStream, stopStream } = useStreamManager();
  const chatApiRef = useRef(new ChatAPI(apiConfig));
  const responseHandlerRef = useRef(new ResponseHandler());

  const handleStream = useCallback(async (message: string) => {
    console.log('Starting stream for message:', message);
    setIsStreaming(true);
    const controller = startStream(chatId);

    try {
      console.log('Sending request to API...');
      const response = await chatApiRef.current.sendMessage(message, chatId, controller.signal);
      console.log('Received API response:', response);
      
      await responseHandlerRef.current.handleStreamedResponse(
        response,
        (chunk) => {
          console.log('Received chunk:', chunk);
          setContent(prev => prev + chunk);
        },
        (fullText) => {
          console.log('Stream completed. Full text:', fullText);
          setContent(fullText);
          setIsStreaming(false);
        }
      );
    } catch (error) {
      console.error('Streaming error:', error);
      if (error instanceof Error) {
        setContent(prev => `${prev}\nError: ${error.message}`);
      }
    } finally {
      console.log('Stream ended');
      setIsStreaming(false);
      stopStream(chatId);
    }
  }, [chatId, startStream, stopStream]);

  return (
    <div className="streaming-content">
      <button 
        onClick={() => handleStream("Tell me a short joke")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Stream
      </button>
      <div className="content">{content}</div>
      {isStreaming && <div className="streaming-indicator">Streaming...</div>}
    </div>
  );
});

StreamingChat.displayName = 'StreamingChat'; 