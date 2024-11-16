"use client";

import { DocumentData } from "firebase/firestore";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  message: DocumentData;
  isStreaming?: boolean;
  streamingContent?: string;
};

function Message({ message, isStreaming, streamingContent }: Props) {
  const isChatGPT = message.user.name === "ChatGPT";
  const displayText = isStreaming ? streamingContent : message.text;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`py-5 text-white ${isChatGPT && "bg-[#434654]"}`}
    >
      <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
        <img src={message.user.avatar} alt="" className="h-8 w-8" />
        <p className="pt-1 text-sm">{displayText}</p>
      </div>
    </motion.div>
  );
}

export default Message;
