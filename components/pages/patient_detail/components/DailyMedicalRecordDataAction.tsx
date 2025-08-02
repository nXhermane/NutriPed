import React from "react";
import { MedicalRecordDataType } from "./DailyMedicalRecordDataActionBottomSheet";
import { VStack } from "@/components/ui/vstack";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { MedicalRecordAnthropometricDataAction } from "./MedicalRecordAnthropometricDataAction";

export interface DailyMedicalRecordDataActionProps {
  data: MedicalRecordDataType;
}

export const DailyMedicalRecordDataAction: React.FC<
  DailyMedicalRecordDataActionProps
> = ({ data }) => {
  const render = () => {
    switch (data.tag) {
      case "anthropometric":
        return <MedicalRecordAnthropometricDataAction />;
      default:
        return <VStack className="h-v-96 bg-red-500"></VStack>;
    }
  };
  return <React.Fragment>{render()}</React.Fragment>;
};
