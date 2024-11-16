"use client";

import { firestore } from "@/firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import useSWR from "swr";

import ModelSelection from "./ModelSelection";

type Props = {
  chatId: string;
  onStreamingUpdate?: (content: string) => void;
};

function ChatInput({ chatId, onStreamingUpdate }: Props) {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [streamingText, setStreamingText] = useState("");
  const isDevelopment = process.env.NODE_ENV === 'development';
  const userId = isDevelopment ? 'development-user' : session?.user?.uid;

  const { data: model } = useSWR("model", {
    fallbackData: "gpt-4",
  });

  const generateResponse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!prompt) return;

      const input = prompt.trim();
      setPrompt("");
      setIsLoading(false);
      
      console.log('Starting new chat response...');

      const message: Message = {
        text: input,
        createdAt: serverTimestamp(),
        user: {
          _id: isDevelopment ? 'development-user' : session?.user?.uid!,
          name: isDevelopment ? 'Development User' : session?.user?.name!,
          email: isDevelopment ? 'dev@example.com' : session?.user?.email!,
          avatar: isDevelopment ? 
            'https://ui-avatars.com/api/?name=Dev+User' : 
            session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name!}`,
        },
      };

      await addDoc(
        collection(
          firestore,
          `users/${userId}/chats/${chatId}/messages`
        ),
        message
      );

      const notification = toast.loading("ChatGPT is thinking...");

      const response = await fetch("/api/askQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          chatId,
          model,
          session: isDevelopment ? {
            user: {
              uid: 'development-user',
              email: 'dev@example.com',
              name: 'Development User'
            }
          } : session,
        }),
      });

      console.log('Got initial response from API');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      const decoder = new TextDecoder();
      let currentText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream complete. Final length:', currentText.length);
          break;
        }

        const chunk = decoder.decode(value);
        console.log('Raw chunk received:', chunk);
        
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            console.log('Processing data:', data);
            
            if (data === '[DONE]') {
              console.log('Received DONE signal');
              toast.success("ChatGPT has responded!", {
                id: notification,
              });
              setIsLoading(true);
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                currentText += parsed.content;
                console.log('Updated streaming text:', currentText);
                onStreamingUpdate?.(currentText);
              }
            } catch (error) {
              console.error('Error parsing streaming data:', error);
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-sm">
      <form onSubmit={generateResponse} className="p-5 space-x-5 flex">
        <input
          type="text"
          placeholder="Type your message here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={!isDevelopment && !session}
          className={`bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300 ${
            !loading && "animate-pulse"
          }`}
        />

        {loading ? (
          <button
            type="submit"
            disabled={!prompt || (!isDevelopment && !session)}
            className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 -rotate-45"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!isDevelopment && !session}
            className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 animate-spin"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        )}
      </form>
      <div className="md:hidden">
        <ModelSelection />
      </div>
    </div>
  );
}

export default ChatInput;
