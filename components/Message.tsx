"use client";

import { DocumentData } from "firebase/firestore";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  message: DocumentData;
  isStreaming?: boolean;
};

function Message({ message, isStreaming }: Props) {
  const isChatGPT = message.user.name === "ChatGPT";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className={`py-5 text-white ${isChatGPT && "bg-[#434654]"}`}
      style={{ minHeight: '3.5rem' }}
    >
      <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
        <div className="flex-shrink-0 w-8">
          <img src={message.user.avatar} alt="" className="h-8 w-8" style={{ opacity: 1 }} />
        </div>
        <div className="flex-1 pt-1">
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Message;
