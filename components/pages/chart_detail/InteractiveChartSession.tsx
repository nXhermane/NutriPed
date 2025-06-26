import { VStack } from "@/components/ui/vstack";
import { GrowthReferenceChartDto } from "@/core/diagnostics";
import React from "react";

export interface InteractiveChartSessionProps {
  title?: string;
  growthChartDto?: GrowthReferenceChartDto;
}

export const InteractiveChartSession: React.FC<
  InteractiveChartSessionProps
> = ({ title, growthChartDto }) => {
  return (
    <VStack className="mx-2 rounded-xl bg-background-secondary px-2 py-v-2"></VStack>
  );
};
