"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/firebase";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  id: string;
};

function ChatRow({ id }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const userEmail = session?.user?.email || (isDevelopment ? 'development-user' : null);

  const [messages] = useCollection(
    userEmail ?
      collection(firestore, 'users', userEmail, 'chats', id, 'messages')
      : null
  );

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id));
  }, [pathname, id]);

  const removeChat = async () => {
    if (!userEmail) return;
    await deleteDoc(doc(firestore, 'users', userEmail, 'chats', id));
    router.replace('/');
  };

  const lastMessage = messages?.docs[messages?.docs.length - 1]?.data().text || "New Chat";
  const truncatedMessage = lastMessage.length > 30 ? `${lastMessage.substring(0, 30)}...` : lastMessage;

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton edge="end" onClick={removeChat}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemButton
        selected={active}
        onClick={() => router.push(`/chat/${id}`)}
      >
        <ListItemIcon>
          <ChatIcon />
        </ListItemIcon>
        <ListItemText 
          primary={truncatedMessage}
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default ChatRow;
