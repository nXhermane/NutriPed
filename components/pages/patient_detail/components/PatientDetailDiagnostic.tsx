import { VStack } from "@/components/ui/vstack";
import React from "react";
import { InitPatientRootSecure } from "./InitPatient";

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
