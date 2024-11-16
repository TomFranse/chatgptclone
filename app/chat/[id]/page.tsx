"use client";

import Chat from "@/components/Chat";
import ChatInput from "@/components/ChatInput";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

function ChatPage({ params: { id } }: Props) {
  const [streamingContent, setStreamingContent] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col h-screen overflow-hidden"
    >
      <Chat 
        chatId={id} 
        streamingContent={streamingContent} 
        onStreamingUpdate={setStreamingContent}
      />
      <ChatInput 
        chatId={id} 
        onStreamingUpdate={setStreamingContent}
      />
    </motion.div>
  );
}

export default ChatPage;
