import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { AnthroSystemCodes } from "@/core/constants";
import { ChartMeasurement } from "@/src/store";
import { Trash } from "lucide-react-native";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { VStack } from "@/components/ui/vstack";
import React, { useEffect, useState } from "react";
import { Badge, BadgeText } from "@/components/ui/badge";
import { IndicatorInterpretionBadgeUiData } from "@/src/constants/ui";
import { Box } from "@/components/ui/box";

export interface MeasurementItemProps {
  data: ChartMeasurement["data"];
  result: ChartMeasurement["results"];
  id: string;
  neededMeasureCodes: AnthroSystemCodes[];
  onDeleteMeasureAction?: () => void;
}
export const MeasurementItem: React.FunctionComponent<MeasurementItemProps> = ({
  id,
  data,
  neededMeasureCodes,
  onDeleteMeasureAction,
  result,
}) => {
  const [indicatorInterpretationData, setIndicatorInterpretationData] =
    useState<
      (typeof IndicatorInterpretionBadgeUiData)[keyof typeof IndicatorInterpretionBadgeUiData]
    >();
  useEffect(() => {
    setIndicatorInterpretationData(
      IndicatorInterpretionBadgeUiData[result.growthIndicatorValue.valueRange]
    );
  }, [result]);
  function MeasurementItemRightAction(
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        justifyContent: "center",
        width: 45,
        transform: [{ translateX: drag.value + 50 }],
      };
    });
    return (
      <Reanimated.View style={styleAnimation}>
        <HStack className="-mb-1 h-[80%] items-center">
          <Pressable
            className="rounded-full bg-red-500"
            onPress={onDeleteMeasureAction && onDeleteMeasureAction}
          >
            <Icon as={Trash} className="m-2 text-typography-primary" />
          </Pressable>
        </HStack>
      </Reanimated.View>
    );
  }

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={MeasurementItemRightAction}
    >
      <VStack className="mt-2 items-center gap-1 overflow-hidden rounded-xl bg-gray-50 px-2 dark:bg-background-secondary">
        <Box
          className={`absolute left-0 h-full w-1 rounded-full ${indicatorInterpretationData?.color}`}
        ></Box>
        <HStack className="w-full items-center justify-between py-1">
          <HStack className="items-center gap-1">
            {neededMeasureCodes
              .filter(
                code =>
                  ![
                    AnthroSystemCodes.AGE_IN_DAY,
                    AnthroSystemCodes.AGE_IN_MONTH,
                  ].includes(code)
              )
              .map(code => {
                const value = data[code];
                if (!value) return null;
                return (
                  <React.Fragment key={code}>
                    <Text
                      key={code}
                      className="font-h3 text-xl font-semibold text-typography-primary"
                    >
                      {value.value}
                    </Text>
                    <Text className="font-light text-xs text-typography-primary_light">
                      {value.unit}
                    </Text>
                  </React.Fragment>
                );
              })}
          </HStack>
          <Text className="font-body text-2xs font-normal text-typography-primary">
            {data[AnthroSystemCodes.AGE_IN_MONTH] &&
            data[AnthroSystemCodes.AGE_IN_MONTH] >= 1
              ? `${data[AnthroSystemCodes.AGE_IN_MONTH]} mois`
              : `${data[AnthroSystemCodes.AGE_IN_DAY]} jours`}
          </Text>
        </HStack>
        <Divider className="h-[1px] bg-primary-border/5" />
        <HStack className="w-full items-center justify-between py-2">
          <Text className="font-h3 text-xs font-semibold text-typography-primary">
            Z-Score: {result?.growthIndicatorValue?.value}
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
    </Swipeable>
  );
};
