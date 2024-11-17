"use client";

import { firestore } from "@/lib/firebase/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession, signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Box, List, ListItem, Button, Divider } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatRow from "./ChatRow";
import ModelSelection from "./ModelSelection";
import NewChat from "./NewChat";

type ChatDocument = {
  createdAt: any;
  lastMessage?: string;
  title?: string;
  userId: string;
}

function Sidebar() {
  const { data: session } = useSession();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const userEmail = session?.user?.email || (isDevelopment ? 'development-user' : null);

  console.log('Session:', session);
  console.log('UserEmail:', userEmail);

  const [chats, loading, error] = useCollection(
    userEmail && userEmail.length > 0 ?
      query(
        collection(firestore, 'users', userEmail, 'chats'),
        orderBy('createdAt', 'desc')
      )
    : null
  );

  console.log('Chats:', chats?.docs.map(doc => ({ id: doc.id, data: doc.data() })));
  console.log('Loading:', loading);
  console.log('Error:', error);

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
            <Box>Error loading chats: {error.message}</Box>
          </ListItem>
        )}

        {chats?.docs.map(chat => {
          const chatData = chat.data() as ChatDocument;
          return (
            <ChatRow 
              key={chat.id} 
              id={chat.id} 
              lastMessage={chatData.lastMessage}
              title={chatData.title}
            />
          );
        })}
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
