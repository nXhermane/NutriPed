import { FadeInCardX } from "@/components/custom/motion";
import { GrowthIndicatorValueDto, AnthroSystemCodes } from "@/core/diagnostics";
import React from "react";
import { IndicatorCard } from "./IndicatorCard";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";

export interface AnthropometricCalculatorResultProps {
  title?: string;
  results: GrowthIndicatorValueDto[];
}

export const AnthropometricCalculatorResult: React.FC<
  AnthropometricCalculatorResultProps
> = ({ results, title }) => {
  return (
    <React.Fragment>
      <VStack className="mx-4 mt-5 gap-4 pb-8">
        <HStack>
          <Heading className="text-center font-h4 text-sm font-medium text-typography-primary">
            {title ?? "Resultat du calcule anthropometrique"}
          </Heading>
        </HStack>
        {results?.map(indicatorValue => (
          <FadeInCardX key={indicatorValue.code}>
            <IndicatorCard value={indicatorValue} />
          </FadeInCardX>
        ))}
      </VStack>
    </React.Fragment>
  );
};
