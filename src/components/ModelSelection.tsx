"use client";

import React from "react";
import useSWR from "swr";
import { DEFAULT_MODEL, AVAILABLE_MODELS } from '@/config/modelConfig';
import { FormControl, Select, MenuItem, Box } from '@mui/material';

interface ModelOption {
  value: string;
  label: string;
}

interface ModelsData {
  modelOption: ModelOption[];
}

const fetchModels = async (): Promise<ModelsData> => {
  // Clear existing cache for testing
  localStorage.removeItem('openai-models');

  const data = await fetch("/api/getEngines")
    .then(res => {
      if (!res.ok) {
        console.error('Failed to fetch models:', res.status, res.statusText);
        return null;
      }
      return res.json();
    })
    .catch((error) => {
      console.error('Error fetching models:', error);
      return null;
    }) || { 
      modelOption: Object.entries(AVAILABLE_MODELS).map(([id, config]) => ({
        value: id,
        label: config.name
      }))
    };

  localStorage.setItem('openai-models', JSON.stringify({
    data,
    timestamp: Date.now()
  }));
  
  return data;
};

function ModelSelection() {
  const { data: models } = useSWR<ModelsData>("models", fetchModels, {
    fallbackData: { 
      modelOption: Object.entries(AVAILABLE_MODELS).map(([id, config]) => ({
        value: id,
        label: config.name
      }))
    },
    refreshInterval: 3600000 // Refresh every hour
  });
  
  const { data: model, mutate: setModel } = useSWR<string>("model", {
    fallbackData: DEFAULT_MODEL
  });

  return (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth variant="outlined" size="small">
        <Select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          sx={{
            borderRadius: 3,
            bgcolor: 'background.default',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,255,255,0.1)'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,255,255,0.2)'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main'
            }
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
