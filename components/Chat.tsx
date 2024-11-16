"use client";

import { useEffect, useRef } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { useSession } from "next-auth/react";
import { Box, CircularProgress, Typography } from '@mui/material';
import Message from "./Message";

type Props = {
  chatId: string;
  streamingContent: string;
  onStreamingUpdate: (content: string) => void;
};

function Chat({ chatId, streamingContent }: Props) {
  const { data: session } = useSession();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const userId = isDevelopment ? 'development-user' : session?.user?.uid;

  const [messages, loading] = useCollection(
    userId ?
      query(
        collection(
          firestore,
          "users",
          userId,
          "chats",
          chatId,
          "messages"
        ),
        orderBy("createdAt", "asc")
      )
    : null
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Get the last message from the database
  const lastMessage = messages?.docs[messages?.docs.length - 1]?.data();
  const isLastMessageFromAssistant = lastMessage?.user.name === "ChatGPT";

  return (
    <Box sx={{ 
      flexGrow: 1,
      overflow: 'auto',
      position: 'relative'
    }}>
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

      {messages?.docs.map((message, index) => {
        const messageData = message.data();
        const isLastChatGPTMessage = 
          messageData.user.name === "ChatGPT" && 
          index === messages.docs.length - 1;

        // Skip the last ChatGPT message if we're streaming
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
