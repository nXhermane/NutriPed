import {
  CardPressEffect,
  CardPressEffectProps,
} from "@/components/custom/motion";
import { VStack } from "@/components/ui/vstack";
import { GrowthStandard } from "@/core/constants";
import { IndicatorUIType } from "@/src/hooks";
import { HumanDateFormatter } from "@/utils";
import { ChartCardBadge } from "./ChartCardBadge";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { BadgeCheck, Calendar, Ruler } from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { Sex } from "@/core/shared";
import React from "react";

export interface ChartCardProps extends CardPressEffectProps {
  name: string;
  indicator: IndicatorUIType;
  sex: Sex;
  standard: GrowthStandard;
  updatedAt: string;
  uiData: { label: string; by: string };
}
const ChartCardComponent: React.FC<ChartCardProps> = ({
  indicator,
  sex,
  name,
  standard,
  uiData,
  updatedAt,
  ...props
}) => {
  const updateAtUIText = HumanDateFormatter.toRelativeDate(updatedAt);
  return (
    <CardPressEffect {...props}>
      <VStack
        className={`gap-3 rounded-2xl border-b-2 bg-background-secondary px-3 py-v-3 ${indicator.borderColor}`}
      >
        <HStack className={"justify-between"}>
          <ChartCardBadge
            label={indicator.label}
            icon={indicator.icon}
            color={indicator.color}
          />
          <ChartCardBadge
            label={
              sex === Sex.MALE
                ? "Garçons"
                : sex === Sex.FEMALE
                  ? "Filles"
                  : "Patients"
            }
            icon={
              sex === Sex.MALE
                ? "Mars"
                : sex === Sex.FEMALE
                  ? "Venus"
                  : "VenusAndMars"
            }
            color={indicator.color}
          />
        </HStack>
        <VStack className="gap-2">
          <Heading
            className={
              "py-1 font-h4 text-sm font-medium text-typography-primary"
            }
          >
            {name}
          </Heading>
          <HStack className="items-center gap-1">
            <Icon
              as={uiData.by === "age" ? Calendar : Ruler}
              className={"h-4 w-4 text-primary-c_light"}
            />
            <Text className="font-light text-xs text-typography-primary_light">
              {uiData.by === "age"
                ? "Âge:"
                : uiData.by === "height"
                  ? "Taille debout:"
                  : "Taille couchée:"}
            </Text>
            <Text className="font-light text-xs text-typography-primary_light">
              {uiData.label}
            </Text>
          </HStack>
          <HStack className="items-center gap-1">
            <Icon as={BadgeCheck} className={"h-4 w-4 text-primary-c_light"} />
            <Text className="font-light text-xs text-typography-primary_light">
              {"Standard:"}
            </Text>
            <Text className="font-light text-xs uppercase text-typography-primary_light">
              {standard}
            </Text>
          </HStack>
        </VStack>
        <Divider className={"h-[1px] border-primary-border/10"} />
        <VStack>
          <Text
            className={"font-body text-2xs font-normal text-primary-border/50"}
          >
            Mise à jour: {updateAtUIText}
          </Text>
        </VStack>
      </VStack>
    </CardPressEffect>
  );
};

export const ChartCard = React.memo(ChartCardComponent);
