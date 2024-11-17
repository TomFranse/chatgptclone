"use client";

import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import { Box } from '@mui/material';
import { useState, use } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function ChatPage({ params }: Props) {
  const { id } = use(params);
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
