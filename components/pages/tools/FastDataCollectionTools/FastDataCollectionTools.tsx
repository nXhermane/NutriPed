import { Text } from "@/components/ui/text";
import React from "react";
import { GeneralInformationStep } from "./GeneralInformationStep";
import { MeasureAndClinicalDataStep } from "./MeasureAndClinicalDataStep";
import { Wizard, WizardStepProps } from "@/components/custom";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Option } from "lucide-react-native";
export const FAST_DATA_COLLECTION_WORKFLOW: Record<string, WizardStepProps> = {
  step1: {
    label: "Information générales",
    stepNumber: 1,
    children: <GeneralInformationStep />,
    nextBtnLabel: "Suivante",
  },
  step2: {
    label: "Donnée du patient",
    stepNumber: 2,
    children: <MeasureAndClinicalDataStep />,
    nextBtnLabel: "Enregistrer",
    prevBtnLabel: "Précedente",
  },
};
export function FastDataCollectionTools() {
  return (
    <React.Fragment>
      <Wizard startStep={1}>
        {Object.values(FAST_DATA_COLLECTION_WORKFLOW).map(step => (
          <Wizard.Step key={step.stepNumber} {...step} />
        ))}
      </Wizard>
      <Fab placement="top right" className="mt-10">
        <FabIcon as={Option} className="" />
      </Fab>
    </React.Fragment>
  );
}
