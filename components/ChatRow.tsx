"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
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

  const [messages] = useCollection(
    collection(firestore, 'users', session?.user?.email!, 'chats', id, 'messages')
  );

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id));
  }, [pathname, id]);

  const removeChat = async () => {
    await deleteDoc(doc(firestore, 'users', session?.user?.email!, 'chats', id));
    router.replace('/');
  };

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
          primary={messages?.docs[messages.docs.length - 1]?.data().text || "New Chat"}
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
