"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { firestore } from "@/lib/firebase/firebase";
import { collection, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = {
  id: string;
  lastMessage?: string;
  title?: string;
};

function ChatRow({ id, lastMessage = "New message", title = "New Chat" }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const userEmail = session?.user?.email || (isDevelopment ? 'development-user' : null);

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id));
  }, [pathname, id]);

  const removeChat = async () => {
    if (!userEmail) return;
    await deleteDoc(doc(firestore, 'users', userEmail, 'chats', id));
    router.replace('/');
  };

  const displayText = title || "New Chat";

  const [messages] = useCollection(
    userEmail ? 
      query(
        collection(firestore, 'users', userEmail, 'chats', id, 'messages'),
        orderBy('createdAt', 'desc')
      )
    : null
  );

  const lastMessageText = messages?.docs[0]?.data()?.text || lastMessage;
  const truncatedMessage = lastMessageText.length > 30 
    ? `${lastMessageText.substring(0, 30)}...` 
    : lastMessageText;

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
          primary={displayText}
          secondary={truncatedMessage}
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
