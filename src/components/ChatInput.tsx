"use client";

import { FormEvent, useState } from "react";
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSession } from "next-auth/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/src/lib/firebase/firebase";
import toast from "react-hot-toast";
import ModelSelection from "@/components/ModelSelection";
import useSWR from "swr";

type Props = {
  chatId: string;
  onStreamingUpdate: (content: string) => void;
};

function ChatInput({ chatId, onStreamingUpdate }: Props) {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const { data: model } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo",
  });

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    const input = prompt.trim();
    setPrompt("");

    onStreamingUpdate("");

    const userEmail = session?.user?.email || (isDevelopment ? 'development-user' : null);
    if (!userEmail) return;

    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: userEmail,
        name: session?.user?.name || 'Development User',
        email: userEmail,
        avatar: session?.user?.image || `https://ui-avatars.com/api/?name=Dev`,
      },
    };

    await addDoc(
      collection(firestore, 'users', userEmail, 'chats', chatId, 'messages'),
      message
    );

    const notification = toast.loading('ChatGPT is thinking...');

    try {
      const response = await fetch('/api/askQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          chatId,
          model,
          session: isDevelopment ? { user: { email: 'development-user' } } : session,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = response.body;
      if (!data) return;

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamedContent = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        
        // Parse the SSE data
        const lines = chunkValue.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                streamedContent += parsed.content;
                onStreamingUpdate(streamedContent);
              }
            } catch (error) {
              console.error('Error parsing chunk:', error);
            }
          }
        }
      }

      toast.success('ChatGPT has responded!', {
        id: notification,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Something went wrong. Please try again later.', {
        id: notification,
      });
    }
  };

  return (
    <Box sx={{ position: 'sticky', bottom: 0, width: '100%' }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 2,
          bgcolor: 'background.paper'
        }}
      >
        <ModelSelection />
        <Box
          component="form"
          onSubmit={sendMessage}
          sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
            alignItems: 'center'
          }}
        >
          <TextField
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            variant="outlined"
            placeholder="Type your message here..."
            fullWidth
            multiline
            maxRows={5}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <IconButton 
            type="submit" 
            disabled={!prompt || (!session && !isDevelopment)}
            color="primary"
            sx={{ p: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

export default ChatInput;
