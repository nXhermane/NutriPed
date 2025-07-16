import { Text } from "@/components/ui/text";
import React from "react";

export interface GlobalDiagnosticResultProps {}

export const GlobalDiagnosticResult: React.FC<
  GlobalDiagnosticResultProps
> = ({}) => {
  return (
    <React.Fragment>
      <Text>This is the result of global diagnostic</Text>
    </React.Fragment>
  );
};
