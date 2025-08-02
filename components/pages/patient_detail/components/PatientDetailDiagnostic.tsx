import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";
import { InitPatientRootSecure } from "./InitPatientRootSecure";

export interface PatientDetailDiagnosticProps {}

const PatientDetailDiagnosticComponent: React.FC<
  PatientDetailDiagnosticProps
> = ({}) => {
  return <VStack></VStack>;
};

export const PatientDetailDiagnostic: React.FC<
  PatientDetailDiagnosticProps
> = props => {
  return (
    <InitPatientRootSecure>
      <PatientDetailDiagnosticComponent {...props} />
    </InitPatientRootSecure>
  );
};
