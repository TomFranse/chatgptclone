"use client";

import { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query, limit } from "firebase/firestore";
import { firestore } from "@/lib/firebase/firebase";
import { useSession } from "next-auth/react";
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import Message from "./Message";

const MESSAGES_PER_PAGE = 20;

type Props = {
  chatId: string;
  streamingContent: string;
  onStreamingUpdate: (content: string) => void;
};

function Chat({ chatId, streamingContent }: Props) {
  const { data: session } = useSession();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messagesLimit, setMessagesLimit] = useState(MESSAGES_PER_PAGE);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const userEmail = session?.user?.email || (isDevelopment ? 'development-user' : null);

  const [messages, loading] = useCollection(
    userEmail ?
      query(
        collection(firestore, "users", userEmail, "chats", chatId, "messages"),
        orderBy("createdAt", "desc"),
        limit(messagesLimit)
      )
    : null
  );

  const loadMore = () => {
    setMessagesLimit(prev => prev + MESSAGES_PER_PAGE);
  };

  // Reverse messages for display
  const displayMessages = messages?.docs.slice().reverse();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const lastMessage = messages?.docs[messages?.docs.length - 1]?.data();
  const isLastMessageFromAssistant = lastMessage?.user.name === "ChatGPT";

  return (
    <Box sx={{ 
      flexGrow: 1,
      overflow: 'auto',
      position: 'relative'
    }}>
      {messages?.size === messagesLimit && (
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Button onClick={loadMore}>Load More</Button>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {messages?.empty && (
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Typography>Type a prompt below to get started!</Typography>
        </Box>
      )}

      {displayMessages?.map((message, index) => {
        const messageData = message.data();
        const isLastChatGPTMessage = 
          messageData.user.name === "ChatGPT" && 
          index === displayMessages.length - 1;

        if (isLastChatGPTMessage && streamingContent) {
          return null;
        }

        return <Message key={message.id} message={messageData} />;
      })}

      {streamingContent && (
        <Message
          message={{
            text: streamingContent,
            createdAt: null,
            user: {
              _id: "ChatGPT",
              name: "ChatGPT",
              email: "",
              avatar: "https://links.papareact.com/89k",
            },
          }}
          isStreaming
        />
      )}

      <div ref={messagesEndRef} />
    </Box>
  );
}

export default Chat;
