import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { AVAILABLE_MODELS } from '@/config/modelConfig';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const models = await openai.models.list();
    
    // Log all available models
    console.log('All OpenAI models:', models.data.map(m => m.id));
    
    const gptModels = models.data.filter(model => 
      model.id.includes('gpt-4') || 
      model.id.includes('gpt-3.5-turbo')
    );
    
    // Log GPT models
    console.log('GPT models:', gptModels.map(m => m.id));
    
    const supportedModels = gptModels
      .filter(model => AVAILABLE_MODELS[model.id])
      .map(model => ({
        value: model.id,
        label: AVAILABLE_MODELS[model.id].name
      }));
    
    // Log final supported models
    console.log('Final supported models:', supportedModels);

    return NextResponse.json({
      modelOption: supportedModels
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    // Log the fallback models we're using
    const fallbackModels = Object.entries(AVAILABLE_MODELS).map(([id, config]) => ({
      value: id,
      label: config.name
    }));
    console.log('Using fallback models:', fallbackModels);
    
    return NextResponse.json({
      modelOption: fallbackModels
    });
  }
} 