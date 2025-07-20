import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import {
  BiochemicalRangeStatus,
  BiologicalAnalysisInterpretationDto,
  GetBiochemicalReferenceRequest,
} from "@/core/diagnostics";
import React, { useMemo } from "react";
import { FadeInCardY } from "@/components/custom/motion";
import { HStack } from "@/components/ui/hstack";
import { useBiochemicalReference } from "@/src/hooks";
import { Loading } from "@/components/custom";

export interface BiologicalInterpretationResultsProps {
  results: BiologicalAnalysisInterpretationDto[];
}

export const BiologicalInterpretationResults: React.FC<
  BiologicalInterpretationResultsProps
> = ({ results }) => {
  return (
    <React.Fragment>
      <VStack className="pb-v-4">
        <VStack className="px-4 pb-v-4">
          <Heading className="font-h4 text-lg font-medium text-typography-primary">
            Interpretation Biologique
          </Heading>
        </VStack>
        <VStack className="gap-1 px-4 pb-v-5">
          {results.map((result, index) => (
            <FadeInCardY key={result.code} delayNumber={2 * index}>
              <BiologicalInterpretationItem data={result} />
            </FadeInCardY>
          ))}
        </VStack>
      </VStack>
    </React.Fragment>
  );
};

export interface BiologicalInterpretationItemProps {
  data: BiologicalAnalysisInterpretationDto;
}

export const BiologicalInterpretationItem: React.FC<
  BiologicalInterpretationItemProps
> = ({ data }) => {
  const getBioRef = useMemo<GetBiochemicalReferenceRequest>(
    () => ({
      code: data.code,
    }),
    [data.code]
  );
  const {
    data: biochemicalRef,
    error,
    onLoading,
  } = useBiochemicalReference(getBioRef);

  if (onLoading) return <Loading />;
  return (
    <VStack
      className={`overflow-hidden rounded-xl border-l-2 bg-background-secondary px-3 py-v-2 ${data.status === BiochemicalRangeStatus.NORMAL ? "border-green-500" : data.status === BiochemicalRangeStatus.UNDER ? "border-orange-500" : data.status === BiochemicalRangeStatus.OVER ? "border-red-500" : "border-primary-border"}`}
    >
      <HStack className="justify-between">
        <Text className="font-h4 text-sm font-medium text-typography-primary">
          {biochemicalRef[0]?.name}
        </Text>
        <Text
          className={`rounded-full px-2 py-1 text-center font-body text-xs font-normal uppercase ${data.status === BiochemicalRangeStatus.NORMAL ? "bg-green-500/5 text-green-500" : data.status === BiochemicalRangeStatus.OVER ? "bg-red-500/5 text-red-500" : data.status === BiochemicalRangeStatus.UNDER ? "bg-orange-500/5 text-orange-500" : ""}`}
        >
          {data.status === BiochemicalRangeStatus.NORMAL
            ? "Normal"
            : data.status === BiochemicalRangeStatus.OVER
              ? "Élevé"
              : data.status === BiochemicalRangeStatus.UNDER
                ? "Faible"
                : ""}
        </Text>
      </HStack>
      <HStack>
        <Text className="font-light text-xs text-typography-primary_light">
          {data.interpretation.join(" • ")}
        </Text>
      </HStack>
    </VStack>
  );
};
