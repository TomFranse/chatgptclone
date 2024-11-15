import { firestore } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

type Props = {
  session: Session | null;
};

function NewChat({ session }: Props) {
  const router = useRouter();
  const isDevelopment = process.env.NODE_ENV === 'development';

  const createNewChat = async () => {
    console.log('Creating new chat...');
    console.log('Development mode:', isDevelopment);
    console.log('Session:', session);

    try {
      const userId = isDevelopment ? 'development-user' : session?.user?.uid;
      const userEmail = isDevelopment ? 'dev@example.com' : session?.user?.email;

      console.log('Using userId:', userId);
      console.log('Using userEmail:', userEmail);

      if (!isDevelopment && !session) {
        console.error('No session and not in development mode');
        toast.error('Authentication required');
        return;
      }

      const collectionPath = `users/${userId}/chats`;
      console.log('Attempting to create document in:', collectionPath);

      try {
        const collectionRef = collection(firestore, collectionPath);
        console.log('Collection reference created');

        const docData = {
          userId: userId,
          userEmail: userEmail,
          createdAt: serverTimestamp() as Timestamp,
        };
        console.log('Document data:', docData);

        const doc = await addDoc(collectionRef, docData);
        console.log('Document created with ID:', doc.id);

        if (!doc.id) {
          console.error('Document created but no ID returned');
          toast.error('Failed to create new chat');
          return;
        }

        const chatPath = `/chat/${doc.id}`;
        console.log('Navigating to:', chatPath);
        router.push(chatPath);
        toast.success('New chat created!');

      } catch (firestoreError: any) {
        console.error('Firestore operation failed:', firestoreError);
        console.error('Error code:', firestoreError.code);
        console.error('Error message:', firestoreError.message);
        toast.error(`Database error: ${firestoreError.message}`);
      }

    } catch (error: any) {
      console.error('Top level error:', error);
      console.error('Error stack:', error.stack);
      toast.error('Failed to create new chat');
    }
  };

  return (
    <div 
      className="chatRow border-gray-700 border" 
      onClick={() => {
        console.log('New Chat button clicked');
        createNewChat();
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
          clipRule="evenodd"
        />
      </svg>
      <p>New Chat</p>
    </div>
  );
}

export default NewChat;
