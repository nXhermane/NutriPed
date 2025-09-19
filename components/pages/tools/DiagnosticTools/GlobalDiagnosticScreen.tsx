import { VStack } from "@/components/ui/vstack";
import { GlobalDiagnosticAnthropometricStep } from "./GlobalDiagnosticAnthropometricStep";
import { GlobalDiagnosticClinicalStep } from "./GlobalDiagnosticClinicalStep";
import { GlobalDiagnosticBiologicalStep } from "./GlobalDiagnosticBiologicalStep";
import { GlobalDiagnosticResult } from "./GlobalDiagnosticResult";
import { Wizard, WizardStepProps } from "@/components/custom/Wizard";

export const DIAGNOSTIC_WORKFLOW: Record<string, WizardStepProps> = {
  step1: {
    label: "Calcule Anthropometrique",
    stepNumber: 1,
    children: <GlobalDiagnosticAnthropometricStep />,
    nextBtnLabel: "Suivante",
  },
  step2: {
    label: "Données cliniques",
    stepNumber: 2,
    children: <GlobalDiagnosticClinicalStep />,
    nextBtnLabel: "Suivante",
    prevBtnLabel: "Précédente",
  },
  step3: {
    label: "Données biologiques",
    stepNumber: 3,
    children: <GlobalDiagnosticBiologicalStep />,
    nextBtnLabel: "Suivante",
    prevBtnLabel: "Précédente",
  },
  step4: {
    label: "Diagnostic",
    stepNumber: 4,
    children: <GlobalDiagnosticResult />,
    nextBtnLabel: "Analyser",
    prevBtnLabel: "Précédente",
  },
};
export function GlobalDiagnosticScreen() {
  return (
    <VStack className="flex-1 bg-background-primary">
      <Wizard startStep={1}>
        {Object.values(DIAGNOSTIC_WORKFLOW).map(step => (
          <Wizard.Step key={step.stepNumber} {...step} />
        ))}
      </Wizard>
    </VStack>
  );
}
