import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";
import { InitPatientRootSecure } from "./InitPatientRootSecure";

export interface PatientDetailDiagnosticProps {}

export const PatientDetailDiagnostic: React.FC<
  PatientDetailDiagnosticProps
> = ({}) => {
  return (
    <InitPatientRootSecure>
      <VStack>
        <Text>This is the patient diagnostic detail screen</Text>
      </VStack>
    </InitPatientRootSecure>
  );
};
