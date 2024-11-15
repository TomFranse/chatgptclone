import openai from "./chatgpt";
import { adminDb } from "@/firebase/firebaseAdmin";

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

    console.log('Making OpenAI request with:', { model, messages });

    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.9,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (!response.choices[0].message?.content) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response received:', response.choices[0].message.content);
    return response.choices[0].message.content;

  } catch (error: any) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key');
    }
    if (error.response?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded');
    }
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured in environment');
    }
    
    throw error;
  }
};

export default query;
