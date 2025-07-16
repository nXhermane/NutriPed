import { Text } from "@/components/ui/text";
import React from "react";

export interface GlobalDiagnosticClinicalStepProps {}

export const GlobalDiagnosticClinicalStep: React.FC<
  GlobalDiagnosticClinicalStepProps
> = ({}) => {
  return (
    <React.Fragment>
      <Text>This is the second step of global diagnostic</Text>
    </React.Fragment>
  );
};
