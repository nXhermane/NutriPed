import React from "react";
import { VStack } from "@/components/ui/vstack";
import { MedicalRecordDataType } from "./DailyMedicalRecordDataActionBottomSheet";
import { MedicalRecordAnthropometricDataAction } from "./MedicalRecordAnthropometricDataAction";
import { MedicalRecordBiologicalDataAction } from "./MedicalRecordBiologicalDataAction";
import { MedicalRecordClinicalSignDataAction } from "./MedicalRecordClinicalSignDataAction";
import { MedicalRecordComplicationDataAction } from "./MedicalRecordComplicationDataAction";

export interface DailyMedicalRecordDataActionProps {
  data: MedicalRecordDataType;
}

export const DailyMedicalRecordDataAction: React.FC<
  DailyMedicalRecordDataActionProps
> = ({ data }) => {
  const render = () => {
    switch (data.tag) {
      case "anthropometric":
        return <MedicalRecordAnthropometricDataAction data={data.data} />;
      case "biological":
        return <MedicalRecordBiologicalDataAction data={data.data} />;
      case "clinical":
        return <MedicalRecordClinicalSignDataAction data={data.data} />;
      case "complication":
        return <MedicalRecordComplicationDataAction data={data.data} />;
      default:
        return <VStack className="h-v-96 bg-red-500"></VStack>;
    }
  };
  return <React.Fragment>{render()}</React.Fragment>;
};
