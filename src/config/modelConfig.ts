export type ModelConfig = {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  defaultParams: {
    temperature: number;
    stream: boolean;
  };
};

export const AVAILABLE_MODELS: { [key: string]: ModelConfig } = {
  'gpt-4': {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best at complex tasks',
    contextLength: 8192,
    defaultParams: {
      temperature: 0.7,
      stream: true,
    },
  },
  'gpt-4-turbo-preview': {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
    description: 'Latest GPT-4 model with improved capabilities',
    contextLength: 128000,
    defaultParams: {
      temperature: 0.7,
      stream: true,
    },
  },
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    contextLength: 4096,
    defaultParams: {
      temperature: 0.7,
      stream: true,
    },
  },
  'gpt-3.5-turbo-16k': {
    id: 'gpt-3.5-turbo-16k',
    name: 'GPT-3.5 Turbo 16K',
    description: 'Same as standard GPT-3.5 but with 16K context',
    contextLength: 16384,
    defaultParams: {
      temperature: 0.7,
      stream: true,
    },
  },
};

export const getModelConfig = (modelId: string): ModelConfig => {
  const config = AVAILABLE_MODELS[modelId];
  if (!config) {
    throw new Error(`Model ${modelId} not found in configuration`);
  }
  return config;
};

export const DEFAULT_MODEL = 'gpt-4'; 