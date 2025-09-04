import { FormHandler } from "@/components/custom/DynamicFormGenerator";
import { useWizardStep } from "@/components/custom/Wizard";
import { VStack } from "@/components/ui/vstack";
import React, { useEffect, useRef } from "react";
import { AnthropometricCalcualtorForm } from "./AnthropometicCalculatorForm";
import {
  AnthropometricCalculatorFormSchema,
  AnthropometricCalculatorFormZodSchema,
} from "@/src/constants/ui";

export interface GlobalDiagnosticAnthropometricStepProps {}

export const GlobalDiagnosticAnthropometricStep: React.FC<
  GlobalDiagnosticAnthropometricStepProps
> = ({}) => {
  const { onNext, setError, setData, data } = useWizardStep();
  const formRef =
    useRef<FormHandler<typeof AnthropometricCalculatorFormSchema>>(null);

  useEffect(() => {
    onNext(async e => {
      setError(null);
      setData(null);
      const data = await formRef.current?.submit();
      if (data) {
        const { sex, age_in_month, age_in_day, ...anthropometricProps } = data;
        const anthropometricMeasures = Object.values(
          anthropometricProps
        ).filter(value => !!value);
        const request = {
          context: { age_in_day, age_in_month, sex },
          anthropometricData: { anthropometricMeasures },
        };
        setData({
          formState: formRef.current?.getState(),
          data: request,
        });
      } else {
        e.preventDefault();
        setError("Erreur de validation de donnée");
      }
    });
  }, [formRef]);

  return (
    <React.Fragment>
      <VStack className="flex-1 bg-red-500">
        <VStack className="bg-background-primary">
          <AnthropometricCalcualtorForm
            formRef={formRef}
            schema={AnthropometricCalculatorFormSchema}
            zodSchema={AnthropometricCalculatorFormZodSchema}
            initialState={data?.formState}
          />
        </VStack>
      </VStack>
    </React.Fragment>
  );
};
