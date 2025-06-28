import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { ChartUiDataType } from "@/src/constants/ui";
import React, { useState } from "react";
import { FilterChips } from "../shared";

export interface GrowthChartInteractiveOptionsProps {
  chartUiData: ChartUiDataType;
  displayRange:
    | ChartUiDataType["availableDisplayRange"][number]["range"]
    | "all";
  setDisplayRange: (
    range: ChartUiDataType["availableDisplayRange"][number]["range"] | "all"
  ) => void;
}
export const GrowthChartInteractiveOptions: React.FC<
  GrowthChartInteractiveOptionsProps
> = ({ chartUiData, displayRange, setDisplayRange }) => {
  return (
    <VStack>
      <VStack>
        <Text>Plage A Afficher</Text>
        <ChartDisplayRange
          range={chartUiData?.availableDisplayRange || []}
          onChange={value => setDisplayRange(value)}
          value={displayRange}
        />
      </VStack>
    </VStack>
  );
};

interface ChartDisplayRangeProps {
  range: ChartUiDataType["availableDisplayRange"];
  onChange: (
    value: ChartUiDataType["availableDisplayRange"][number]["range"] | "all"
  ) => void;
  value: ChartUiDataType["availableDisplayRange"][number]["range"] | "all";
}

const ChartDisplayRange: React.FC<ChartDisplayRangeProps> = React.memo(
  ({ onChange, range, value }) => {
    return (
      <FilterChips<
        ChartUiDataType["availableDisplayRange"][number]["range"] | "all"
      >
        data={[
          { label: "Tous", value: "all" },
          ...range.map(r => ({ label: r.label, value: r.range })),
        ]}
        value={value}
        onChange={onChange}
      />
    );
  }
);
