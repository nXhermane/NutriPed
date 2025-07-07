import { TopTabNaviagtor } from "@/components/custom";
import { Text } from "@/components/ui/text";
import React from "react";
import { AnthropometricCalculatorPanel } from "./AnthropometricCalculatorPanel";

export const DiagnosticTools = ({}) => {
  return (
    <React.Fragment>
      <TopTabNaviagtor
        tabs={[
          {
            name: "Calcul anthropométrique",
            component: <AnthropometricCalculatorPanel />,
          },
          {
            name: "Évaluation clinique",
            component: <Text>Welcome to clinical evaluation screen</Text>,
          },
          {
            name: "Bilan biologique",
            component: (
              <Text>
                Welcome to biological and laboratory result interpretation
                screen
              </Text>
            ),
          },
          {
            name: "Diagnostic global",
            component: <Text>Welcome to global diagnostic screen</Text>,
          },
        ]}
      />
    </React.Fragment>
  );
};
