"use client";

import { firestore } from "@/src/lib/firebase/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession, signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Box, List, ListItem, Button, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatRow from "@/components/ChatRow";
import ModelSelection from "@/components/ModelSelection";
import NewChat from "@/components/NewChat";

function Sidebar() {
  const { data: session } = useSession();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const userEmail = session?.user?.email || (isDevelopment ? 'development-user' : null);

  const [chats, loading, error] = useCollection(
    userEmail && userEmail.length > 0 ? query(
      collection(firestore, 'users', userEmail, 'chats'),
      orderBy('createdAt', 'desc')
    ) : null
  );

  return (
    <Box sx={{ height: '100vh', overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <NewChat />
        <Divider sx={{ my: 2 }} />
        <ModelSelection />
      </Box>

      <List sx={{ px: 2, mt: 2 }}>
        {loading && (
          <ListItem>
            <Box>Loading Chats...</Box>
          </ListItem>
        )}

        {error && (
          <ListItem>
            <Box>Error loading chats</Box>
          </ListItem>
        )}

        {chats?.docs.map(chat => (
          <ChatRow key={chat.id} id={chat.id} />
        ))}
      </List>

      {session && (
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button
            onClick={() => signOut()}
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
          >
            Log out
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Sidebar;
