import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { AnthroSystemCodes, GrowthIndicatorValueDto } from "@/core/evaluation";
import React, { useEffect, useState } from "react";
import {
  IndicatorInterpretionBadgeUiData,
  TABLE_UI_DATA,
} from "@/src/constants/ui";
import { Divider } from "@/components/ui/divider";
import { Badge, BadgeText } from "@/components/ui/badge";

function returnPercentileValueMachedZScoreValue(zScore: number) {
  switch (zScore) {
    case 0:
      return "100%";
    case -1.5:
      return "85%";
    case -2:
      return "< 80%";
    case -3:
      return "< 70%";
    default:
      return "none";
  }
}
export interface TableInterpretationResultProps {
  indicatorValue: GrowthIndicatorValueDto;
  indicatorName: string;
}

export const TableInterpretationResult: React.FC<
  TableInterpretationResultProps
> = ({ indicatorValue, indicatorName }) => {
  const [indicatorInterpretationData, setIndicatorInterpretationData] =
    useState<
      (typeof IndicatorInterpretionBadgeUiData)[keyof typeof IndicatorInterpretionBadgeUiData]
    >();
  useEffect(() => {
    setIndicatorInterpretationData(
      IndicatorInterpretionBadgeUiData[indicatorValue.valueRange]
    );
  }, [indicatorValue]);
  return (
    <VStack className="m-4 rounded-xl bg-background-secondary px-2 py-2">
      <HStack className="h-v-8 w-full items-center">
        <Text className="font-h4 text-sm font-medium text-typography-primary">
          {indicatorName}
        </Text>
      </HStack>
      <Divider className="h-[1px] bg-primary-border/5" />
      <HStack className="w-full items-center justify-between py-2">
        <Text className="font-h3 text-xs font-semibold text-typography-primary">
          {indicatorValue.code === AnthroSystemCodes.WFLH_UNISEX
            ? `Z-Score: ${indicatorValue?.value}`
            : `Percentile: ${returnPercentileValueMachedZScoreValue(indicatorValue?.value)}`}
        </Text>
        <Badge
          className={` ${indicatorInterpretationData?.color} rounded-full`}
        >
          <BadgeText className="text-normal font-body text-2xs text-white">
            {indicatorInterpretationData?.label}
          </BadgeText>
        </Badge>
      </HStack>
    </VStack>
  );
};
