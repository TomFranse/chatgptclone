"use client";

import { DocumentData } from "firebase/firestore";
import { Box, Paper, Typography, Avatar } from '@mui/material';
import ReactMarkdown from 'react-markdown';

type Props = {
  message: DocumentData;
  isStreaming?: boolean;
};

function Message({ message, isStreaming }: Props) {
  const isAssistant = message.user.name === "ChatGPT";

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 1.5,
        flexDirection: isAssistant ? 'row' : 'row-reverse',
      }}
    >
      <Avatar
        src={message.user.avatar}
        alt={message.user.name}
        sx={{ 
          width: 32, 
          height: 32,
          order: isAssistant ? 0 : 1 
        }}
      />
      
      <Paper
        elevation={0}
        sx={{
          maxWidth: '75%',
          p: 3,
          backgroundColor: isAssistant ? 'grey.100' : 'primary.main',
          color: isAssistant ? '#000000' : 'white',
          borderRadius: '16px',
          borderTopLeftRadius: isAssistant ? 0 : '16px',
          '& p': {
            m: 0,
            fontFamily: 'inherit',
          },
          '& pre': {
            backgroundColor: isAssistant ? 'background.paper' : 'rgba(255,255,255,0.1)',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            maxWidth: '100%',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            color: isAssistant ? 'text.primary' : 'white',
            my: 2,
          },
          '& code': {
            backgroundColor: isAssistant ? 'background.paper' : 'rgba(255,255,255,0.1)',
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            color: isAssistant ? 'text.primary' : 'white',
          },
        }}
      >
        <Typography
          component="div"
          sx={{
            opacity: isStreaming ? 0.7 : 1,
            '& > *': { 
              wordBreak: 'break-word',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              fontFamily: 'inherit',
            },
          }}
        >
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Message;
