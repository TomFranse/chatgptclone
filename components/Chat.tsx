"use client";

import { firestore } from "@/firebase/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";

type Props = {
  chatId: string;
  streamingContent: string;
};

function Chat({ chatId, streamingContent }: Props) {
  const { data: session } = useSession();
  const messageEndRef = useRef<null | HTMLDivElement>(null);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const userId = isDevelopment ? 'development-user' : session?.user?.uid;

  const [messages] = useCollection(
    chatId && userId ? 
      query(
        collection(
          firestore,
          `users/${userId}/chats/${chatId}/messages`
        ),
        orderBy("createdAt", "asc")
      )
    : null
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {messages?.empty && (
        <>
          <p className="mt-10 text-center text-white">
            Type a prompt in below to get started
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 mx-auto mt-5 text-white animate-bounce"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </>
      )}
      {messages?.docs.map((message, index) => {
        const isLastAssistantMessage = index === messages.docs.length - 1 && 
          message.data().user.name === "ChatGPT" && 
          streamingContent;

        if (isLastAssistantMessage) return null;

        return <Message key={message.id} message={message.data()} />;
      })}
      {streamingContent && (
        <Message 
          key="streaming"
          message={{
            text: streamingContent,
            user: {
              _id: "ChatGPT",
              name: "ChatGPT",
              email: "ChatGPT",
              avatar: "https://drive.google.com/uc?export=download&id=1ikaBBU-OsBSHkleHQmf15ww0vgX-A0Kz",
            }
          }}
          isStreaming={true}
        />
      )}
      <div ref={messageEndRef} />
    </div>
  );
}

export default Chat;
