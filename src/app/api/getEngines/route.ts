import { NextResponse } from 'next/server';
import openai from '@/lib/openai/chatgpt';

export async function GET() {
  try {
    const models = await openai.models.list();

    const modelOption = models.data
      .map(model => ({
        value: model.id,
        label: model.id
      }))
      .filter(model => 
        model.value.includes("gpt-3.5") || 
        model.value.includes("gpt-4")
      )
      .sort((a, b) => b.value.localeCompare(a.value));

    return NextResponse.json({
      modelOption,
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { modelOption: [{ value: "gpt-3.5-turbo", label: "GPT-3.5" }] },
      { status: 200 }
    );
  }
} 