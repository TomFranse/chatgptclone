import { NextApiRequest, NextApiResponse } from "next";
import openai from "@/utils/chatgpt";

type Option = {
  value: string;
  label: string;
};

type Data = {
  modelOption: Option[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      modelOption: [],
      error: 'Method not allowed' 
    });
  }

  try {
    const models = await openai.models.list();
    
    const modelOption = models.data
      .filter(model => model.id.includes('gpt'))
      .map((model) => ({
        value: model.id,
        label: model.id,
      }));

    console.log('Available models:', modelOption);
    return res.status(200).json({ modelOption });
    
  } catch (error: any) {
    console.error('OpenAI API Error:', {
      message: error.message,
      status: error.status,
      data: error.response?.data
    });

    // Return a default model option with error
    return res.status(200).json({
      modelOption: [{ value: "gpt-3.5-turbo", label: "GPT-3.5" }],
      error: error.message
    });
  }
}
