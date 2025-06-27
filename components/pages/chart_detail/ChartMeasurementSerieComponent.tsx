import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChartMeasurement, ChartMeasurementSerie } from "@/src/store";
import { ChevronUp, ChevronDown, Trash } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { CardPressEffect } from "@/components/custom/motion";
import { AnthroSystemCodes } from "@/core/constants";
import { Divider } from "@/components/ui/divider";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimted, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
export interface ChartMeasurementSerieComponentProps {
  series: ChartMeasurementSerie[];
  onChooseAction?: (value: { serieId: string }) => void;
  onDeleteMeasureAction?: (measureId: string) => void;
  selectedSerie?: string;
  neededMeasureCodes?: AnthroSystemCodes[];
}
export const ChartMeasurementSerieComponent: React.FC<ChartMeasurementSerieComponentProps> =
  React.memo(
    ({
      series = [],
      onChooseAction,
      selectedSerie,
      neededMeasureCodes = [],
      onDeleteMeasureAction,
    }) => {
      return (
        <Accordion className="gap-3 bg-transparent">
          {[...series]
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .map(serie => (
              <AccordionItem
                value={serie.id}
                key={serie.id}
                className={`rounded-xl ${selectedSerie === serie.id ? "border-[1px] border-blue-500/50" : ""}`}
              >
                <AccordionHeader>
                  <AccordionTrigger
                    onLongPress={() =>
                      onChooseAction && onChooseAction({ serieId: serie.id })
                    }
                  >
                    {({ isExpanded }: any) => {
                      return (
                        <>
                          <AccordionTitleText
                            className={`font-h4 text-lg font-medium`}
                          >
                            {serie.label}
                          </AccordionTitleText>
                          {isExpanded ? (
                            <AccordionIcon as={ChevronUp} />
                          ) : (
                            <AccordionIcon as={ChevronDown} />
                          )}
                        </>
                      );
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  {serie.data.map(item => (
                    <ChartMeasurementComponent
                      key={item.id}
                      data={item.data}
                      id={item.id}
                      neededMeasureCodes={neededMeasureCodes}
                      onDeleteMeasureAction={() => {
                        onDeleteMeasureAction && onDeleteMeasureAction(item.id);
                      }}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      );
    }
  );
export interface ChartMeasurementComponentProps {
  data: ChartMeasurement["data"];
  id: string;
  neededMeasureCodes: AnthroSystemCodes[];
  onDeleteMeasureAction?: () => void;
}
export const ChartMeasurementComponent: React.FunctionComponent<
  ChartMeasurementComponentProps
> = ({ id, data, neededMeasureCodes, onDeleteMeasureAction }) => {
  function ChartMeasurementComponentRightAction(
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
      <Reanimted.View style={styleAnimation}>
        <HStack className="-mb-1 h-[80%] items-center">
          <Pressable
            className="rounded-full bg-red-500"
            onPress={onDeleteMeasureAction && onDeleteMeasureAction}
          >
            <Icon as={Trash} className="m-2 text-typography-primary" />
          </Pressable>
        </HStack>
      </Reanimted.View>
    );
  }

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={ChartMeasurementComponentRightAction}
    >
      <HStack className="mt-2 h-10 items-center gap-1 rounded-xl bg-background-secondary px-2">
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
              <Text
                key={code}
                className="font-h4 text-sm font-normal text-typography-primary"
              >
                {value.value} {value.unit}
              </Text>
            );
          })}
        <Divider className="h-1 w-1 rounded-full bg-primary-border/50" />
        <Text className="font-body text-sm font-normal text-typography-primary">
          {data[AnthroSystemCodes.AGE_IN_MONTH] &&
          data[AnthroSystemCodes.AGE_IN_MONTH] >= 1
            ? `${data[AnthroSystemCodes.AGE_IN_MONTH]} mois`
            : `${data[AnthroSystemCodes.AGE_IN_DAY]} jours`}
        </Text>
      </HStack>
    </Swipeable>
  );
};
