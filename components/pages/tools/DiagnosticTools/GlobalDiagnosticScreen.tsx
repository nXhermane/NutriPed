import { VStack } from "@/components/ui/vstack";
import { GlobalDiagnosticAnthropometricStep } from "./GlobalDiagnosticAnthropometricStep";
import { GlobalDiagnosticClinicalStep } from "./GlobalDiagnosticClinicalStep";
import { GlobalDiagnosticBiologicalStep } from "./GlobalDiagnosticBiologicalStep";
import { GlobalDiagnosticResult } from "./GlobalDiagnosticResult";
import { Wizard } from "@/components/custom/Wizard";

export const DIAGNOSTIC_WORKFLOW = {
  step1: {
    label: "Calcule Anthropometrique",
    stepNumber: 1,
    children: <GlobalDiagnosticAnthropometricStep />,
  },
  step2: {
    label: "Données cliniques",
    stepNumber: 2,
    children: <GlobalDiagnosticClinicalStep />,
  },
  step3: {
    label: "Données biologiques",
    stepNumber: 3,
    children: <GlobalDiagnosticBiologicalStep />,
  },
  step4: {
    label: "Diagnostic",
    stepNumber: 4,
    children: <GlobalDiagnosticResult />,
    nextBtnLabel: "Analyser",
  },
};
export function GlobalDiagnosticScreen() {
  const steps = [
    { label: "Anthropometrie", state: Wizard.States.ENABLED },
    { label: "Clinique", state: Wizard.States.DISABLED },
    { label: "Biologique", state: Wizard.States.DISABLED },
    { label: "Résultats", state: Wizard.States.DISABLED },
  ];
  console.log(config.theme.colors.primary['c_light'])
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
