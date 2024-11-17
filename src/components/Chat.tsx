"use client";

import { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query, limit, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { firestore } from "@/lib/firebase/firebase";
import { useSession } from "next-auth/react";
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import Message from "./Message";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const MESSAGES_PER_PAGE = 20;

type Props = {
  chatId: string;
  streamingContent: string;
  onStreamingUpdate: (content: string) => void;
};

interface MessageData {
  text: string;
  createdAt: any;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

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

  const lastMessage = messages?.docs[messages?.docs.length - 1]?.data() as MessageData | undefined;
  const isLastMessageFromAssistant = lastMessage?.user.name === "ChatGPT";

  return (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        pt: { xs: 8, sm: 3 },
        bgcolor: 'background.default'
      }}
    >
      <Box sx={{ overflow: 'hidden', position: 'relative' }}>
        <SimpleBar style={{ height: '100%', padding: '0 16px' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              px: { xs: 0, sm: 2, md: 4 },
              pb: 3,
            }}
          >
            {messages?.size === messagesLimit && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Button 
                  onClick={loadMore}
                  variant="outlined"
                  size="small"
                >
                  Load More
                </Button>
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

            {displayMessages?.map((message: QueryDocumentSnapshot<DocumentData>, index: number) => {
              const messageData = message.data() as MessageData;
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
        </SimpleBar>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* Add your chat input component here */}
      </Box>
    </Box>
  );
}

export default Chat;
