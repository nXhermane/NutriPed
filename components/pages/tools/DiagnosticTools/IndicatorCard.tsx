import { CardPressEffect } from "@/components/custom/motion";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  GetIndicatorRequest,
  GrowthIndicatorValueDto,
} from "@/core/diagnostics";
import { IndicatorInterpretionBadgeUiData } from "@/src/constants/ui";
import { useGrowthIndicators } from "@/src/hooks";
import { router } from "expo-router";
import { BadgeCheck, Lightbulb, MapPin, Target } from "lucide-react-native";
import React, { useMemo } from "react";
import colors from "tailwindcss/colors";

export interface IndicatorCardProps {
  value: GrowthIndicatorValueDto;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = React.memo(
  ({ value: growthIndicatorValue }) => {
    const getGrowthIndicatorRequest = useMemo<GetIndicatorRequest>(
      () => ({
        code: growthIndicatorValue.code,
      }),
      [growthIndicatorValue.code]
    );

    const { data, onLoading, error } = useGrowthIndicators(
      getGrowthIndicatorRequest
    );
    if (onLoading) {
      return (
        <Spinner size={"large"} className="mt-8" color={colors.blue["600"]} />
      );
    }
    return (
      <CardPressEffect>
        <VStack className="rounded-xl bg-background-secondary px-3 py-3">
          <HStack className="items-center justify-between">
            <VStack className="max-w-[50%] pr-2">
              <Text className="text-left font-h4 text-sm font-medium text-typography-primary">
                {growthIndicatorValue.code}
              </Text>
              <Text className="text-left font-light text-2xs text-typography-primary_light">
                {data[0]?.name}
              </Text>
            </VStack>

            <Badge
              className={`rounded-full py-0 ${IndicatorInterpretionBadgeUiData[growthIndicatorValue.valueRange].color}`}
            >
              <BadgeText
                className={`text-right font-body text-xs font-normal ${IndicatorInterpretionBadgeUiData[growthIndicatorValue.valueRange].textColor}`}
              >
                {
                  IndicatorInterpretionBadgeUiData[
                    growthIndicatorValue.valueRange
                  ].label
                }
              </BadgeText>
            </Badge>
          </HStack>
          <Divider className="mb-2 mt-2 h-[1px] bg-primary-border/5" />
          <VStack className="gap-2">
            <HStack className="justify-between">
              <HStack className="items-center gap-1">
                <Icon as={Target} className={"h-4 w-4 text-primary-c_light"} />
                <Text className="font-light text-xs text-typography-primary dark:text-typography-primary_light">
                  {"Zscore:"}
                </Text>
                <Text className="font-light text-xs uppercase text-typography-primary dark:text-typography-primary_light">
                  {growthIndicatorValue.value}
                </Text>
              </HStack>
              {growthIndicatorValue.reference.sourceType === "growth_curve" && (
                <Pressable
                  className=""
                  onPress={() => {
                    router.navigate({
                      pathname: "/(screens)/growth_chart/[info]",
                      params: {
                        info: JSON.stringify(growthIndicatorValue),
                      },
                    });
                  }}
                >
                  <HStack className="items-center gap-1 rounded-lg bg-primary-c_light dark:bg-primary-c_light/50 px-2 py-[1px]">
                    <Icon
                      as={MapPin}
                      className="h-3 w-3 text-typography-primary dark:text-typography-primary_light"
                    />
                    <Text
                      className={
                        "font-body text-xs font-normal text-typography-primary dark:text-typography-primary_light"
                      }
                    >
                      Tracer
                    </Text>
                  </HStack>
                </Pressable>
              )}
            </HStack>
            <HStack className="items-center gap-1">
              <Icon as={Lightbulb} className={"h-4 w-4 text-primary-c_light"} />
              <Text className="font-light text-xs text-typography-primary dark:text-typography-primary_light">
                {"Interprétation:"}
              </Text>
              <Text
                className="font-light text-xs ttext-typography-primary dark:text-typography-primary_light w-[70%]"
              >
                {
                  data[0]?.interpretations.find(
                    interpretation =>
                      interpretation.code ===
                      growthIndicatorValue.interpretation
                  )?.name
                }
              </Text>
            </HStack>
            <HStack className="items-center gap-1">
              <Icon
                as={BadgeCheck}
                className={"h-4 w-4 text-primary-c_light"}
              />
              <Text className="font-light text-xs text-typography-primary dark:text-typography-primary_light">
                {"Standard:"}
              </Text>
              <Text className="font-light text-xs uppercase text-typography-primary dark:text-typography-primary_light">
                {growthIndicatorValue.reference.standard}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </CardPressEffect>
    );
  }
);
