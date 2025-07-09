import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "react-native";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react-native";

interface HistoryItemProps {
  item: {
    name: string;
    result: any;
    usedData: any;
    createdAt?: string;
  };
  onDelete: () => void;
  onView: () => void;
}

export const AnthropometricCalculatorHistoryItem: React.FC<
  HistoryItemProps
> = ({ item, onDelete, onView }) => {
    
  return (
    <VStack className="border-border-primary rounded-xl border bg-background-secondary p-4">
      <HStack className="mb-2 items-center justify-between">
        <Text className="text-lg font-semibold text-typography-primary">
          {item.name}
        </Text>
        <HStack className="space-x-2">
          <Button className="rounded-full bg-blue-500 p-2" onPress={onView}>
            <ButtonIcon as={Eye} className="text-white" />
          </Button>
          <Button className="rounded-full bg-red-500 p-2" onPress={onDelete}>
            <ButtonIcon as={Trash2} className="text-white" />
          </Button>
        </HStack>
      </HStack>

      <Text className="text-typography-secondary text-sm">
        Âge: {item.usedData.age_in_month} mois
      </Text>
      <Text className="text-typography-secondary text-sm">
        Sexe: {item.usedData.sex}
      </Text>
      {item.createdAt && (
        <Text className="text-typography-secondary mt-2 text-xs">
          Créé le: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      )}
    </VStack>
  );
};
