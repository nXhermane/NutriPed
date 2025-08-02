import { VStack } from "@/components/ui/vstack";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import React from "react";

export interface MedicalRecordAnthropometricDataActionProps {}

export const MedicalRecordAnthropometricDataAction: React.FC<
  MedicalRecordAnthropometricDataActionProps
> = ({}) => {
  return (
    <BottomSheetView>
      <VStack className="h-v-96"></VStack>
    </BottomSheetView>
  );
};
