"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { firestore } from "@/firebase/firebase";
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function NewChat() {
  const router = useRouter();
  const { data: session } = useSession();
  const isDevelopment = process.env.NODE_ENV === 'development';

  const createNewChat = async () => {
    const userEmail = session?.user?.email || (isDevelopment ? 'development-user' : null);
    
    if (!userEmail) {
      console.error('No user email found in session');
      return;
    }

    try {
      const doc = await addDoc(
        collection(firestore, 'users', userEmail, 'chats'),
        {
          userId: userEmail,
          createdAt: serverTimestamp(),
        }
      );

      router.push(`/chat/${doc.id}`);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  return (
    <Button
      onClick={createNewChat}
      variant="outlined"
      fullWidth
      startIcon={<AddIcon />}
      disabled={!session && !isDevelopment}
    >
      New Chat
    </Button>
  );
}

export default NewChat;
