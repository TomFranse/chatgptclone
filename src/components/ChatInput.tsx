"use client";

import { FormEvent, useState } from "react";
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSession } from "next-auth/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase/firebase";
import toast from "react-hot-toast";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";

function ChatInput({ chatId, onStreamingUpdate }: { chatId: string; onStreamingUpdate: (content: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { data: model = "gpt-3.5-turbo" } = useSWR("model");
  const userEmail = session?.user?.email || (process.env.NODE_ENV === 'development' ? 'development-user' : null);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || !userEmail || isLoading) return;

    setIsLoading(true);
    const notificationId = toast.loading('ChatGPT is thinking...');

    try {
      await addDoc(collection(firestore, 'users', userEmail, 'chats', chatId, 'messages'), {
        text: prompt.trim(),
        createdAt: serverTimestamp(),
        user: {
          _id: userEmail,
          name: session?.user?.name || 'Development User',
          email: userEmail,
          avatar: session?.user?.image || `https://ui-avatars.com/api/?name=Dev`,
        },
      });

      const response = await fetch('/api/askQuestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          chatId,
          model,
          session: process.env.NODE_ENV === 'development' ? { user: { email: 'development-user' } } : session,
        }),
      });

      if (!response.ok || !response.body) throw new Error('Failed to send message');

      let content = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.content) {
                content += parsed.content;
                onStreamingUpdate(content);
              }
            } catch (error) {
              console.error('Error parsing chunk:', error);
            }
          }
        }
      }

      toast.success('ChatGPT has responded!', { id: notificationId });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message', { id: notificationId });
    } finally {
      setPrompt("");
      setIsLoading(false);
      onStreamingUpdate("");
    }
  };

  return (
    <Box sx={{ 
      position: 'sticky', 
      bottom: 0, 
      width: '100%',
      bgcolor: 'background.default'
    }}>
      <Box sx={{ p: 2 }}>
        <ModelSelection />
        <Box 
          component="form" 
          onSubmit={sendMessage} 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 2 
          }}
        >
          <TextField
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(e as any)}
            variant="outlined"
            placeholder="Type your message here..."
            fullWidth
            multiline
            maxRows={5}
            disabled={isLoading}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 3,
                bgcolor: 'background.default',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)'
                }
              }
            }}
          />
          <IconButton 
            type="submit" 
            disabled={!prompt.trim() || (!session && process.env.NODE_ENV !== 'development') || isLoading}
            color="primary"
            sx={{ 
              p: 1,
              borderRadius: 3,
              bgcolor: 'background.default'
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default ChatInput;
