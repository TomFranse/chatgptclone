import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
console.log('API Key length:', apiKey?.length);
console.log('API Key prefix:', apiKey?.substring(0, 8));

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey,
});

console.log('OpenAI client initialized');

export default openai;
