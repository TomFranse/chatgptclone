import { NextResponse } from 'next/server';
import openai from '@/utils/chatgpt';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

// Add request caching for repeated prompts
const cache = new Map();

export async function POST(req: Request) {
  const { prompt, chatId, model, session } = await req.json();
  
  // Generate cache key
  const cacheKey = `${prompt}-${model}`;
  
  // Check cache
  if (cache.has(cacheKey)) {
    const cachedResponse = cache.get(cacheKey);
    // Only use cache for very recent requests (last 5 minutes)
    if (Date.now() - cachedResponse.timestamp < 5 * 60 * 1000) {
      return NextResponse.json(cachedResponse.data);
    }
  }

  if (!prompt) {
    return NextResponse.json({ error: "Please provide a prompt!" }, { status: 400 });
  }

  if (!chatId) {
    return NextResponse.json({ error: "Please provide a valid chat ID!" }, { status: 400 });
  }

  const isDevelopment = process.env.NODE_ENV === 'development';
  const userEmail = session?.user?.email || (isDevelopment ? 'development-user' : null);

  if (!userEmail) {
    return NextResponse.json({ error: "User not authenticated!" }, { status: 401 });
  }

  try {
    // Get previous messages
    const chatRef = adminDb
      .collection('users')
      .doc(userEmail)
      .collection('chats')
      .doc(chatId)
      .collection('messages');

    const messages = await chatRef.orderBy('createdAt', 'asc').get();
    
    // Format messages for OpenAI
    const previousMessages = messages.docs.map(doc => {
      const data = doc.data();
      return {
        role: data.user.name === "ChatGPT" ? "assistant" : "user",
        content: data.text
      };
    });

    // Add current prompt
    const allMessages = [
      ...previousMessages,
      { role: "user", content: prompt }
    ];

    const stream = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo",
      messages: allMessages as ChatCompletionMessageParam[],
      temperature: 0.9,
      stream: true,
    });

    let fullAssistantResponse = '';

    const response = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullAssistantResponse += content;
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }

        // Save the complete message to Firebase
        await chatRef.add({
          text: fullAssistantResponse,
          createdAt: Timestamp.now(),
          user: {
            _id: "ChatGPT",
            name: "ChatGPT",
            avatar: "https://links.papareact.com/89k",
          },
        });

        controller.close();
      },
    });

    // Store in cache
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    // Cleanup old cache entries
    if (cache.size > 100) {
      const oldestKey = Array.from(cache.keys())[0];
      cache.delete(oldestKey);
    }

    return new Response(response, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in askQuestion:', error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
} 