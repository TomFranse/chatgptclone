// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { adminDb } from "@/firebase/firebaseAdmin";
import query from "@/utils/queryApi";
import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";
import openai from "@/utils/chatgpt";

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

  try {
    // Set up streaming headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });

    // Get the streaming response
    const response = await openai.chat.completions.create({
      model: model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    let fullContent = '';

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // Send chunk to client
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
        fullContent += content;
      }
    }

    // Send [DONE] to client
    res.write('data: [DONE]\n\n');

    // Store the complete response in the database
    const message: Message = {
      text: fullContent,
      createdAt: admin.firestore.Timestamp.now(),
      user: {
        _id: "ChatGPT",
        name: "ChatGPT",
        email: "ChatGPT",
        avatar: "https://drive.google.com/uc?export=download&id=1ikaBBU-OsBSHkleHQmf15ww0vgX-A0Kz",
      },
    };

    const userId = process.env.NODE_ENV === 'development' ? 
      'development-user' : 
      session?.user?.uid;

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

    res.end();
    
  } catch (error: any) {
    console.error('API Error Details:', error);
    res.status(500).json({ 
      answer: `Error: ${error.message}` 
    });
  }
}
