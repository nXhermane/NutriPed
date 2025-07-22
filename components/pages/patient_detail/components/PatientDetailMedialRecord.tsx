import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";

export interface PatientDetailMedicalRecordProps {}

export const PatientDetailMedicalRecord: React.FC<
  PatientDetailMedicalRecordProps
> = ({}) => {
   const {
      interaction: { isFirstVisitToPatientDetail },
    } = usePatientDetail();
    if (isFirstVisitToPatientDetail) return <InitPatient />;
  return (
    <VStack>
     
    </VStack>
  );
};
