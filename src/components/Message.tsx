"use client";

import { DocumentData } from "firebase/firestore";
import { Paper, Box, Avatar, Typography } from '@mui/material';
import { memo } from 'react';

type MessageProps = {
  message: DocumentData & {
    text: string;
    user: {
      name: string;
      avatar: string;
    }
  };
  isStreaming?: boolean;
};

const Message = memo(({ message, isStreaming }: MessageProps) => {
  const isChatGPT = message.user.name === "ChatGPT";

  return (
    <Paper 
      elevation={0}
      square
      sx={{
        py: 2.5,
        minHeight: '3.5rem',
        bgcolor: isChatGPT ? 'action.hover' : 'background.default',
        whiteSpace: 'pre-wrap'
      }}
    >
      <Box sx={{ display: 'flex', gap: 2.5, px: 5, maxWidth: '2xl', mx: 'auto' }}>
        <Avatar
          src={message.user.avatar}
          alt={message.user.name}
          sx={{ width: 32, height: 32 }}
        />
        <Typography 
          component="div"
          sx={{
            pt: 0.5,
            fontSize: '0.875rem',
            fontFamily: isChatGPT ? 'monospace' : 'inherit',
            '& code': {
              bgcolor: 'action.hover',
              p: '2px 4px',
              borderRadius: 1,
            }
          }}
        >
          {isChatGPT ? message.text.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          )) : message.text}
        </Typography>
      </Box>
    </Paper>
  );
}, (prev, next) => prev.message.text === next.message.text && prev.isStreaming === next.isStreaming);

export default Message;
