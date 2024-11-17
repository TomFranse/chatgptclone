"use client";

import React from "react";
import useSWR from "swr";
import { DEFAULT_MODEL } from '@/config/modelConfig';
import { FormControl, Select, MenuItem, Box } from '@mui/material';

interface ModelOption {
  value: string;
  label: string;
}

interface ModelsData {
  modelOption: ModelOption[];
}

const fetchModels = async (): Promise<ModelsData> => {
  const cached = JSON.parse(localStorage.getItem('openai-models') || '{}');
  if (cached.data && Date.now() - cached.timestamp < 3600000) {
    return cached.data;
  }

  const data = await fetch("/api/getEngines")
    .then(res => res.ok ? res.json() : null)
    .catch(() => null) || { 
      modelOption: [{ value: DEFAULT_MODEL, label: "GPT-4" }] 
    };

  localStorage.setItem('openai-models', JSON.stringify({
    data,
    timestamp: Date.now()
  }));
  
  return data;
};

function ModelSelection() {
  const { data: models } = useSWR<ModelsData>("models", fetchModels, {
    fallbackData: { modelOption: [{ value: DEFAULT_MODEL, label: "GPT-4" }] }
  });
  
  const { data: model, mutate: setModel } = useSWR<string>("model", {
    fallbackData: DEFAULT_MODEL
  });

  return (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth>
        <Select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          sx={{
            bgcolor: 'background.paper',
            '& .MuiSelect-select': { py: 1.5 }
          }}
        >
          {models?.modelOption.map(({ value, label }: ModelOption) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default ModelSelection;
