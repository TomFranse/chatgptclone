"use client";

import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import { Box } from '@mui/material';
import { useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

function ChatPage({ params: { id } }: Props) {
  const [streamingContent, setStreamingContent] = useState("");

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Chat 
        chatId={id} 
        streamingContent={streamingContent} 
        onStreamingUpdate={setStreamingContent}
      />
      <ChatInput 
        chatId={id} 
        onStreamingUpdate={setStreamingContent}
      />
    </Box>
  );
}

export default ChatPage;
