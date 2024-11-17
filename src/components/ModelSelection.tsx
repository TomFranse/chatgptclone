"use client";

import React from "react";
import useSWR from "swr";
import { DEFAULT_MODEL } from '@/config/modelConfig';
import { FormControl, Select, MenuItem, CircularProgress, Box } from '@mui/material';

const fetchModels = async () => {
  const cacheKey = 'openai-models';
  const cachedModels = localStorage.getItem(cacheKey);
  
  if (cachedModels) {
    const { data, timestamp } = JSON.parse(cachedModels);
    // Use cache if less than 1 hour old
    if (Date.now() - timestamp < 60 * 60 * 1000) {
      return data;
    }
  }

  try {
    const res = await fetch("/api/getEngines");
    if (!res.ok) throw new Error('Failed to fetch models');
    const data = await res.json();
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    
    return data;
  } catch (error) {
    return { modelOption: [{ value: DEFAULT_MODEL, label: "GPT-4" }] };
  }
};

function ModelSelection() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { data: models } = useSWR("models", fetchModels, {
    fallbackData: { modelOption: [{ value: DEFAULT_MODEL, label: "GPT-4" }] }
  });
  
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: DEFAULT_MODEL
  });

  const handleChange = (event: any) => {
    setIsLoading(true);
    setModel(event.target.value);
    console.log('Model selected:', event.target.value);
    setIsLoading(false);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <FormControl fullWidth>
          <Select
            value={model}
            onChange={handleChange}
            sx={{
              bgcolor: 'background.paper',
              '& .MuiSelect-select': {
                py: 1.5,
              }
            }}
          >
            {models?.modelOption.map((option: { value: string; label: string }) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
}

export default ModelSelection;
