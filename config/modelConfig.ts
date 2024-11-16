export type ModelConfig = {
  value: string;
  label: string;
  defaultParams: {
    temperature: number;
    stream: boolean;
  };
};

const DEFAULT_PARAMS = {
  temperature: 0.7,
  stream: true,
};

export const getModelConfig = (modelId: string): ModelConfig => {
  return {
    value: modelId,
    label: modelId,
    defaultParams: DEFAULT_PARAMS,
  };
};

export const DEFAULT_MODEL = 'gpt-4'; 