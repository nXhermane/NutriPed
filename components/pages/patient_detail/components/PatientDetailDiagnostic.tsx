import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";

export interface PatientDetailDiagnosticProps {}

export const PatientDetailDiagnostic: React.FC<
  PatientDetailDiagnosticProps
> = ({}) => {
   const {
    interaction: { isFirstVisitToPatientDetail },
  } = usePatientDetail();
  if (isFirstVisitToPatientDetail) return <InitPatient />;
  return (
    <VStack>
      <Text>This is the patient diagnostic detail screen</Text>
    </VStack>
  );
};
