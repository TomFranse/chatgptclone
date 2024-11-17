"use client";

import { useState } from 'react';
import { Box, Drawer, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import ClientProvider from "./ClientProvider";

type Props = {
  children: React.ReactNode;
  session: any;
  isDevelopment: boolean;
};

export default function RootLayoutClient({ children, session, isDevelopment }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 320;

  if (!session && !isDevelopment) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile hamburger menu */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            position: 'absolute', 
            top: theme.spacing(2), 
            left: theme.spacing(2), 
            zIndex: 2 
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        <Sidebar />
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'hidden',
          ml: isMobile ? 0 : 0, // Remove margin when sidebar is permanent
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
        }}
      >
        {children}
      </Box>

      <ClientProvider />
    </Box>
  );
} 