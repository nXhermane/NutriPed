import { FadeInCardX } from "@/components/custom/motion";
import { GrowthIndicatorValueDto } from "@/core/diagnostics";
import React from "react";
import { IndicatorCard } from "./IndicatorCard";
import { VStack } from "@/components/ui/vstack";

export interface AnthropometricCalculatorResultProps {
  results: GrowthIndicatorValueDto[];
}

export const AnthropometricCalculatorResult: React.FC<
  AnthropometricCalculatorResultProps
> = ({ results }) => {
  return (
    <React.Fragment>
      <VStack className="mx-4 mb-8 mt-5 gap-4">
        {results.map(indicatorValue => (
          <FadeInCardX key={indicatorValue.code}>
            <IndicatorCard value={indicatorValue} />
          </FadeInCardX>
        ))}
      </VStack>
    </React.Fragment>
  );
};
