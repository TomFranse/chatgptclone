import openai from "./chatgpt";
import { adminDb } from "@/lib/firebase/firebaseAdmin";

const query = async (prompt: string, chatId: string, model: string) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      throw new Error('OpenAI API key is not configured');
    }

    // Fetch previous messages from Firestore
    const messagesRef = adminDb
      .collection("users")
      .doc("development-user")
      .collection("chats")
      .doc(chatId)
      .collection("messages");

    const messagesDocs = await messagesRef.orderBy("createdAt", "asc").get();
    
    // Format messages for OpenAI
    const messages = messagesDocs.docs.map(doc => {
      const message = doc.data();
      return {
        role: (message.user._id === "ChatGPT" ? "assistant" : "user") as "assistant" | "user",
        content: message.text
      };
    });

    // Add the current prompt
    messages.push({
      role: "user" as "user",
      content: prompt
    });

    console.log('Making OpenAI streaming request with:', { model, messages });

    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
      stream: true, // Enable streaming
    });

    let fullContent = '';
    
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';
      console.log('Received chunk:', content);
      fullContent += content;
    }

    console.log('Stream complete. Full content:', fullContent);
    return fullContent;

  } catch (error: any) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw error;
  }
};

export default query;
