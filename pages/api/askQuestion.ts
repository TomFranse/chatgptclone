// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { adminDb } from "@/firebase/firebaseAdmin";
import query from "@/utils/queryApi";
import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session } = req.body;

  if (!prompt) {
    res.status(400).json({ answer: "Please Provide a prompt" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat Id" });
    return;
  }

  console.log('API Request received:', { prompt, chatId, model });
  console.log('Environment:', process.env.NODE_ENV);
  console.log('OpenAI Key exists:', !!process.env.OPENAI_API_KEY);

  try {
    // ChatGPT Query
    const response = await query(prompt, chatId, model);
    console.log('OpenAI Response received');

    const message: Message = {
      text: response || "ChatGPT unable to answer that!",
      createdAt: admin.firestore.Timestamp.now(),
      user: {
        _id: "ChatGPT",
        name: "ChatGPT",
        email: "ChatGPT",
        avatar:
          "https://drive.google.com/uc?export=download&id=1ikaBBU-OsBSHkleHQmf15ww0vgX-A0Kz",
      },
    };

    const userId = process.env.NODE_ENV === 'development' ? 
      'development-user' : 
      session?.user?.uid;

    console.log('Using userId:', userId);

    if (!userId) {
      throw new Error('No user ID available');
    }

    await adminDb
      .collection("users")
      .doc(userId)
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add(message);

    console.log('Message saved to Firestore');
    res.status(200).json({ answer: message.text });
    
  } catch (error: any) {
    console.error('API Error Details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      answer: `Error: ${error.response?.data?.error?.message || error.message}` 
    });
  }
}
