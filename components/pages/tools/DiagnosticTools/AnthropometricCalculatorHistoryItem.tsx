import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "react-native";
import { Eye, Trash2 } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Divider } from "@/components/ui/divider";
import { CardPressEffect } from "@/components/custom/motion";
import { HumanDateFormatter } from "@/utils";
import { AnthropometricCalculatorResultDataType } from "@/src/store";

interface HistoryItemProps {
  item: AnthropometricCalculatorResultDataType;
  onDelete: () => void;
  onView: () => void;
}

export const AnthropometricCalculatorHistoryItem: React.FC<
  HistoryItemProps
> = ({ item, onDelete, onView }) => {
  const createdAtUIDate = HumanDateFormatter.toRelativeDate(item.createdAt);
  return (
    <CardPressEffect onPress={onView}>
      <VStack className="border-border-primary rounded-xl bg-background-secondary p-2">
        <HStack className="items-center justify-between">
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {item.name}
          </Text>
          {/* <Button className="" variant="link" onPress={onView}>
            <ButtonText className="">Voir</ButtonText>
          </Button> */}
          {/* <Pressable className="rounded-full bg-red-500 p-2" onPress={onDelete}>
            <Icon as={Trash2} className="h-4 w-4 text-white" />
          </Pressable> */}
          <HStack className="items-center gap-4">
            <Text className="font-body text-2xs font-normal text-typography-primary_light">
              {"Sexe: "} {item.usedData.sex.toUpperCase()}
            </Text>
            <Text className="font-body text-2xs font-normal text-typography-primary_light">
              {"Âge(mois): "} {Math.trunc(item.usedData.age_in_month)}
            </Text>
          </HStack>
        </HStack>

        <Divider className={"mb-1 mt-1 h-[1px] border-primary-border/10"} />
        <HStack className="items-center justify-between">
          <Text
            className={"font-body text-2xs font-normal text-primary-border/50"}
          >
            {createdAtUIDate}
          </Text>
          <HStack>
            <Pressable className="rounded-full py-2" onPress={onDelete}>
              <Icon as={Trash2} className="h-4 w-4 text-red-500" />
            </Pressable>
          </HStack>
        </HStack>
      </VStack>
    </CardPressEffect>
  );
};
