"use client";

import { Box, Stack } from '@mui/material';
import Sidebar from "@/components/Sidebar";
import ClientProvider from "@/components/ClientProvider";

type Props = {
  children: React.ReactNode;
  session: any;
  isDevelopment: boolean;
};

export default function RootLayoutClient({ children, session, isDevelopment }: Props) {
  if (!session && !isDevelopment) {
    return null;
  }

  return (
    <Stack direction="row" sx={{ height: '100vh' }}>
      <Box sx={{ 
        width: { xs: '100%', md: '20rem' },
        maxWidth: 'xs',
        height: '100%',
        overflow: 'auto'
      }}>
        <Sidebar />
      </Box>
      <ClientProvider />
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
    </Stack>
  );
} 