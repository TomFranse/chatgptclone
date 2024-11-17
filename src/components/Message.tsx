"use client";

import { DocumentData } from "firebase/firestore";
import { Box, Paper, Typography, Avatar } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';

type Props = {
  message: DocumentData;
  isStreaming?: boolean;
};

function Message({ message, isStreaming }: Props) {
  const isAssistant = message.user.name === "ChatGPT";

  const markdownComponents: Components = {
    h1: ({ children }) => (
      <Typography variant="h1">{children}</Typography>
    ),
    h2: ({ children }) => (
      <Typography variant="h2">{children}</Typography>
    ),
    h3: ({ children }) => (
      <Typography variant="h3">{children}</Typography>
    ),
    h4: ({ children }) => (
      <Typography variant="h4">{children}</Typography>
    ),
    p: ({ children }) => (
      <Typography variant="body1">{children}</Typography>
    ),
    // Table components
    table: ({ children }) => (
      <Box sx={{ overflowX: 'auto', my: 2 }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>{children}</table>
      </Box>
    ),
    th: ({ children }) => (
      <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f5f5f5' }}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{children}</td>
    ),
    
    // Strikethrough
    del: ({ children }) => (
      <Typography component="del" sx={{ textDecoration: 'line-through' }}>
        {children}
      </Typography>
    ),
    
    // Line Break
    br: () => <br />,
    
    // Code blocks with syntax highlighting
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

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
          },
          '& pre': {
            backgroundColor: isAssistant ? 'background.paper' : 'rgba(255,255,255,0.1)',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            maxWidth: '100%',
            fontFamily: 'monospace',
            color: isAssistant ? 'text.primary' : 'white',
            my: 2,
          },
          '& code': {
            backgroundColor: isAssistant ? 'background.paper' : 'rgba(255,255,255,0.1)',
            px: 1,
            py: 0.5,
            borderRadius: 0.5,
            fontFamily: 'monospace',
            color: isAssistant ? 'text.primary' : 'white',
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            mb: 2,
          },
          '& th, & td': {
            border: '1px solid',
            borderColor: isAssistant ? 'grey.300' : 'rgba(255,255,255,0.2)',
            p: 1,
          },
          '& th': {
            backgroundColor: isAssistant ? 'grey.200' : 'rgba(255,255,255,0.1)',
          },
          // Add support for horizontal rules
          '& hr': {
            border: 'none',
            borderTop: '1px solid',
            borderColor: isAssistant ? 'grey.300' : 'rgba(255,255,255,0.2)',
            my: 2,
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
            },
          }}
        >
          <ReactMarkdown
            remarkPlugins={[gfm]}
            components={markdownComponents}
          >
            {message.text}
          </ReactMarkdown>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Message;
