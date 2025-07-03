import {
  CardPressEffect,
  CardPressEffectProps,
} from "@/components/custom/motion";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { GrowthStandard } from "@/core/constants";
import { TABLE_UI_DATA } from "@/src/constants/ui";
import { Text } from "@/components/ui/text";
import React from "react";
import { ChartCardBadge } from "../ChartTools/ChartCardBadge";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { BadgeCheck } from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import { HumanDateFormatter } from "@/utils";

export interface TableCardProps extends CardPressEffectProps {
  name: string;
  standard: GrowthStandard;
  updatedAt: string;
  uiData: (typeof TABLE_UI_DATA)[keyof typeof TABLE_UI_DATA];
}

export const TableCard: React.FC<TableCardProps> = ({
  name,
  standard,
  uiData: { indicator },
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
            label={"UNISEXE"}
            icon={"VenusAndMars"}
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
