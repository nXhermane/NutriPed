import { TopTabNaviagtor } from "@/components/custom";
import { Text } from "@/components/ui/text";
import React from "react";
import { SuggestMilkPanel } from "./SuggestMilkPanel";
import { MedicineDosagePanel } from "./MedicineDosagePanel";

export interface CalculToolsProps {}

export const CalculTools: React.FC<CalculToolsProps> = ({}) => {
  return (
    <React.Fragment>
      <TopTabNaviagtor
        tabs={[
          {
            name: "Suggestion du lait",
            component: <SuggestMilkPanel />,
          },
          {
            name: "Dosage de médicament",
            component: <MedicineDosagePanel />,
          },
        ]}
      />
    </React.Fragment>
  );
};
