import { useEffect, useRef } from 'react';

interface StreamManager {
  activeStreams: Map<string, AbortController>;
  isStreaming: Map<string, boolean>;
}

export const useStreamManager = () => {
  const streamManagerRef = useRef<StreamManager>({
    activeStreams: new Map(),
    isStreaming: new Map()
  });

  const startStream = (chatId: string) => {
    const controller = new AbortController();
    streamManagerRef.current.activeStreams.set(chatId, controller);
    streamManagerRef.current.isStreaming.set(chatId, true);
    return controller;
  };

  const stopStream = (chatId: string) => {
    const controller = streamManagerRef.current.activeStreams.get(chatId);
    if (controller) {
      controller.abort();
      streamManagerRef.current.activeStreams.delete(chatId);
      streamManagerRef.current.isStreaming.set(chatId, false);
    }
  };

  // Handle window blur/focus events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Stop all active streams when window loses focus
        streamManagerRef.current.activeStreams.forEach((_, chatId) => {
          stopStream(chatId);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Add cleanup for abandoned streams
  useEffect(() => {
    const cleanup = () => {
      streamManagerRef.current.activeStreams.forEach((controller, chatId) => {
        controller.abort();
      });
      streamManagerRef.current.activeStreams.clear();
      streamManagerRef.current.isStreaming.clear();
    };

    window.addEventListener('beforeunload', cleanup);
    return () => window.removeEventListener('beforeunload', cleanup);
  }, []);

  return { startStream, stopStream };
}; 