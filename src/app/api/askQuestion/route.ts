import { NextResponse } from 'next/server';
import openai from '@/lib/openai/chatgpt';
import { adminDb } from '@/lib/firebase/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

// TTL Cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

export async function POST(req: Request) {
  try {
    const { prompt, chatId, model, session } = await req.json();
    
    if (!prompt || !chatId) {
      return NextResponse.json({ 
        error: !prompt ? "Missing prompt" : "Missing chat ID" 
      }, { status: 400 });
    }

    const userEmail = session?.user?.email || 
      (process.env.NODE_ENV === 'development' ? 'development-user' : null);
    
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check cache
    const cacheKey = `${prompt}-${model}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Get messages from Firebase
    const chatRef = adminDb
      .collection('users')
      .doc(userEmail)
      .collection('chats')
      .doc(chatId)
      .collection('messages');

    const messages = await chatRef.orderBy('createdAt', 'asc').get();
    
    const allMessages: ChatCompletionMessageParam[] = [
      ...messages.docs.map(doc => ({
        role: doc.data().user.name === "ChatGPT" ? "assistant" as const : "user" as const,
        content: doc.data().text
      })),
      { role: "user" as const, content: prompt }
    ];

    const stream = await openai.chat.completions.create({
      model: model || "gpt-3.5-turbo",
      messages: allMessages,
      temperature: 0.9,
      stream: true,
    });

    let fullResponse = '';
    const response = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
          }
        }

        await chatRef.add({
          text: fullResponse,
          createdAt: Timestamp.now(),
          user: {
            _id: "ChatGPT",
            name: "ChatGPT",
            avatar: "https://links.papareact.com/89k",
          },
        });

        // Update cache and cleanup if needed
        cache.set(cacheKey, { data: response, timestamp: Date.now() });
        if (cache.size > MAX_CACHE_SIZE) cache.delete(Array.from(cache.keys())[0]);

        controller.close();
      },
    });

    return new Response(response, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in askQuestion:', error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
} 