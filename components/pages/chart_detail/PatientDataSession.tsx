import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { GrowthReferenceChartDto, IndicatorDto } from "@/core/diagnostics";
import React from "react";

export interface PatientDataSessionProps {
  growthChartDto: GrowthReferenceChartDto;
  indicatorDto: IndicatorDto;
}

export const PatientDataSession: React.FC<PatientDataSessionProps> = ({
  growthChartDto,
  indicatorDto,
}) => {
  console.log(indicatorDto.neededMeasureCodes);
  return (
    <VStack className="m-4 rounded-xl bg-background-secondary px-3 py-3">
      <HStack className="h-v-10">
        <Heading className="font-h4 text-lg font-medium text-typography-primary">
          Données du patient
        </Heading>
      </HStack>
      <VStack></VStack>
    </VStack>
  );
};
