import { NextApiRequest, NextApiResponse } from "next";
import openai from "@/utils/chatgpt";

type Option = {
  value: string;
  label: string;
};

type Data = {
  modelOption: Option[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const models = await openai.models.list();

    const modelOption = models.data.map((model) => ({
      value: model.id,
      label: model.id,
    }));

    res.status(200).json({
      modelOption,
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      modelOption: [{ value: "gpt-3.5-turbo", label: "GPT-3.5" }]
    });
  }
}
