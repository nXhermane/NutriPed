import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetPortal,
} from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import { MedicineDto } from "@/core/nutrition_care";
import { useUI } from "@/src/context";
import React from "react";
import { Dimensions } from "react-native";
import colors from "tailwindcss/colors";

export interface MedicineDetailBottomSheetProps {
  isOpen?: boolean;
  medicineDto: MedicineDto;
  onClose?: () => void;
}

export const MedicineDetailBottomSheet: React.FC<
  MedicineDetailBottomSheetProps
> = ({ isOpen, medicineDto, onClose }) => {
  const { colorMode } = useUI();

  return (
    <BottomSheet snapToIndex={isOpen ? 1 : -1} onClose={onClose && onClose}>
      <BottomSheetPortal
        containerStyle={{
          position: "fixed",
          height: Dimensions.get("window").height,
        }}
        detached
        index={1}
        snapPoints={["25%", "50%", "75%"]}
        enableContentPanningGesture={false}
        backdropComponent={BottomSheetBackdrop}
        handleIndicatorStyle={{
          backgroundColor:
            colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
        }}
        handleComponent={props => <BottomSheetDragIndicator {...props} />}
        backgroundComponent={props => {
          return (
            <VStack
              {...props}
              className="rounded-2xl bg-background-secondary"
            />
          );
        }}
      >
        <BottomSheetContent className="bg-background-secondary">
          <VStack className="h-v-96 w-full"></VStack>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
};
