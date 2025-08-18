import { FadeInCardX } from "@/components/custom/motion/FadeInCardX";
import { GrowthIndicatorValueDto } from "@/core/evaluation";
import React from "react";
import { IndicatorCard } from "./IndicatorCard";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

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
        <VStack className="pb-v-4">
          <Heading className="font-h4 text-lg font-medium text-typography-primary">
            {title ?? "Indicateurs de Croissance"}
          </Heading>
          <Text className="font-body text-xs font-normal text-typography-primary_light">
            Évaluation anthropométrique selon les références OMS
          </Text>
        </VStack>

        {results?.map(indicatorValue => (
          <FadeInCardX key={indicatorValue.code}>
            <IndicatorCard value={indicatorValue} />
          </FadeInCardX>
        ))}
      </VStack>
    </React.Fragment>
  );
};
