import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetPortal,
  BottomSheetTrigger,
} from "@/components/ui/bottomsheet";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ChevronUp } from "lucide-react-native";
import React from "react";

export interface GrowthChartComponentProps {
  isOpen?: boolean;
}
export const GrowthChartComponent: React.FC<GrowthChartComponentProps> = () => {
  return (
    <BottomSheet>
      <VStack className="m-4">
        <BottomSheetTrigger>
          <HStack className="h-v-10 items-center justify-center gap-4 rounded-xl bg-blue-500">
            <VStack className="gap-0">
              <Icon as={ChevronUp} className="text-typography-primary" />
              <Icon as={ChevronUp} className="text-typography-primary_light" />
            </VStack>
            <Text className="font-h4 font-medium text-typography-primary">
              Afficher la courbe
            </Text>
            <VStack className="gap-0">
              <Icon as={ChevronUp} className="text-typography-primary" />
              <Icon as={ChevronUp} className="text-typography-primary_light" />
            </VStack>
          </HStack>
        </BottomSheetTrigger>
      </VStack>

      <BottomSheetPortal
        snapPoints={["25%", "50%"]}
        backdropComponent={BottomSheetBackdrop}
        handleComponent={BottomSheetDragIndicator}
        backgroundStyle={{
            backgroundColor: "red"
        }}
      >
        <BottomSheetContent className="bg-background-secondary">
          <VStack className="h-v-64"></VStack>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
};


