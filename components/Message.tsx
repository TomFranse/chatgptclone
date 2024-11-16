"use client";

import { DocumentData } from "firebase/firestore";
import { Paper, Box, Avatar, Typography } from '@mui/material';

type Props = {
  message: DocumentData;
  isStreaming?: boolean;
};

function Message({ message, isStreaming }: Props) {
  const isChatGPT = message.user.name === "ChatGPT";

  // Function to format the message text
  const formatMessage = (text: string) => {
    // If it's a ChatGPT response, preserve whitespace and line breaks
    if (isChatGPT) {
      return text.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ));
    }
    // For user messages, just return the text
    return text;
  };

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
      <Box 
        sx={{ 
          display: 'flex',
          gap: 2.5,
          px: 5,
          maxWidth: '2xl',
          mx: 'auto'
        }}
      >
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
              backgroundColor: 'action.hover',
              padding: '2px 4px',
              borderRadius: 1,
            }
          }}
        >
          {formatMessage(message.text)}
        </Typography>
      </Box>
    </Paper>
  );
}

export default Message;
