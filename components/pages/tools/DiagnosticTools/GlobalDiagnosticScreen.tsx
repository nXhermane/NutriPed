import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { GlobalDiagnosticAnthropometricStep } from "./GlobalDiagnosticAnthropometricStep";
import { GlobalDiagnosticClinicalStep } from "./GlobalDiagnosticClinicalStep";
import { GlobalDiagnosticBiologicalStep } from "./GlobalDiagnosticBiologicalStep";
import { GlobalDiagnosticResult } from "./GlobalDiagnosticResult";
import { ScrollView } from "react-native";
import { Wizard } from "react-native-ui-lib";
import { remapProps } from "react-native-css-interop";
import config from "@/theme";
import colors from "tailwindcss/colors";
const RMWizard = remapProps(Wizard, {
  className: "containerStyle",
});
const RMWizardStep = remapProps(Wizard.Step, {
  labelClassName: "labelStyle",
});
const RMProgressStep = remapProps(ProgressStep, {});
export function GlobalDiagnosticScreen() {
  const steps = [
    { label: "Anthropometrie", state: Wizard.States.ENABLED },
    { label: "Clinique", state: Wizard.States.DISABLED },
    { label: "Biologique", state: Wizard.States.DISABLED },
    { label: "Résultats", state: Wizard.States.DISABLED },
  ];
  console.log(config.theme.colors.primary['c_light'])
  return (
    <VStack className="flex-1 items-center justify-between bg-background-primary">
      <ScrollView>
        <ProgressSteps topOffset={0} progressBarColor="red">
          <ProgressStep
            label="First Step"
            scrollable
            activeStep={3}
            buttonFillColor={config.theme.colors.primary['c_light']}
            
          >
            <GlobalDiagnosticAnthropometricStep />
          </ProgressStep>
          <ProgressStep label="First Step">
            <GlobalDiagnosticClinicalStep />
          </ProgressStep>
          <ProgressStep label="First Step">
            <GlobalDiagnosticBiologicalStep />
          </ProgressStep>
          <ProgressStep label="First Step">
            <GlobalDiagnosticResult />
          </ProgressStep>
        </ProgressSteps>
      </ScrollView>

      {/* <RMWizard
        activeIndex={0}
        containerStyle={{
          backgroundColor: colors.,
          borderBottomWidth: 0,
        }}
        className={"border-b-0 bg-transparent"}
      >
        {steps.map((item, index) => (
          <RMWizardStep labelClassName="bg-red-500 text-white border-0" key={index} state={item.state} label={item.label} />
        ))}
      </RMWizard> */}
    </VStack>
  );
}
