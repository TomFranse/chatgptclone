"use client";

import React from "react";
import Select from "react-select";
import useSWR from "swr";

const fetchModels = async () => {
  try {
    const res = await fetch("/api/getEngines");
    if (!res.ok) throw new Error('Failed to fetch models');
    return res.json();
  } catch (error) {
    return { modelOption: [{ value: "gpt-3.5-turbo", label: "GPT-3.5" }] };
  }
};

function ModelSelection() {
  interface ModelOption {
    value: string;
    label: string;
  }

  const [isLoading, setIsLoading] = React.useState(false);
  const { data: models } = useSWR("models", fetchModels, {
    fallbackData: { modelOption: [{ value: "gpt-3.5-turbo", label: "GPT-3.5" }] }
  });
  
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo"
  });

  return (
    <div className="mt-2">
      {isLoading ? (
        <div className="mt-2 text-white">Loading models...</div>
      ) : (
        <Select
          instanceId="model-select"
          className="mt-2"
          options={models?.modelOption}
          defaultValue={models?.modelOption.find((opt: ModelOption) => opt.value === model)}
          isSearchable
          menuPosition="fixed"
          classNames={{
            control: () => "bg-[#434654] border-[#434654]"
          }}
          onChange={(e) => {
            setIsLoading(true);
            setModel(e?.value);
            setIsLoading(false);
          }}
          value={models?.modelOption.find((opt: ModelOption) => opt.value === model)}
          components={{
            LoadingIndicator: () => null,
            IndicatorSeparator: () => null
          }}
        />
      )}
    </div>
  );
}

export default ModelSelection;
