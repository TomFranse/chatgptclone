import { firestore } from "./firebase";
import { collection, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { ChatMessage } from "@/types/chat";

export async function saveMessage({
  userEmail,
  chatId,
  message,
}: {
  userEmail: string;
  chatId: string;
  message: ChatMessage;
}) {
  const messageWithTimestamp = {
    ...message,
    createdAt: serverTimestamp(),
  };

  // Save the message
  const messageRef = doc(collection(firestore, 'users', userEmail, 'chats', chatId, 'messages'));
  await setDoc(messageRef, messageWithTimestamp);

  // Update the chat's lastMessage
  const chatRef = doc(firestore, 'users', userEmail, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessage: message.text,
    updatedAt: serverTimestamp(),
  });
}