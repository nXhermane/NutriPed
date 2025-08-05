import { VStack } from "@/components/ui/vstack";
import React from "react";
import { InitPatientRootSecure } from "./InitPatient";
import { useNutritionalDiagnostic } from "@/src/hooks";
import { Loading } from "@/components/custom";

export interface PatientDetailDiagnosticProps {}

const PatientDetailDiagnosticComponent: React.FC<
  PatientDetailDiagnosticProps
> = ({}) => {
  const { data, error, onLoading } = useNutritionalDiagnostic();

  if (onLoading) return <Loading />;

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
