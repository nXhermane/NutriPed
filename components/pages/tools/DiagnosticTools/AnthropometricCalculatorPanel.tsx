import React, { useRef, useState } from "react";
import { AnthropometricCalcualtorForm } from "./AnthropometicCalculatorForm";
import {
  AnthropometricCalculatorFormSchema,
  AnthropometricCalculatorFormZodSchema,
} from "@/src/constants/ui";
import { FormHandler } from "@/components/custom";
import { usePediatricApp } from "@/adapter";
import { GrowthIndicatorValueDto } from "@/core/diagnostics";
import { FadeInCardY } from "@/components/custom/motion";
import { AnthropometricCalculatorResult } from "./AnthropometricCalculatorResult";
import { VStack } from "@/components/ui/vstack";

export const AnthropometricCalculatorPanel = ({}) => {
  const {
    diagnosticServices: { growthIndicatorValue },
  } = usePediatricApp();
  const [anthropometricCalculatorResult, setAnthropometricCalculatorResult] =
    useState<GrowthIndicatorValueDto[] | null>(null);
  const formRef =
    useRef<FormHandler<typeof AnthropometricCalculatorFormSchema>>(null);
  const [onSubmit, setOnSubmit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [onSucess, setOnSucess] = useState<boolean>(false);

  const handleFormSubmit = async () => {
    setOnSubmit(true);
    setError(null);
    setAnthropometricCalculatorResult(null);
    setOnSucess(false);
    const data = await formRef.current?.submit();
    if (data) {
      const { sex, age_in_month, age_in_day, ...anthropometricProps } = data;
      const anthropometricMeasures = Object.values(anthropometricProps).filter(
        value => !!value
      );
      const result = await growthIndicatorValue.calculateAllAvailableIndicator({
        age_in_day,
        age_in_month,
        sex,
        anthropometricData: { anthropometricMeasures },
      });
      if ("data" in result) {
        setOnSucess(true);
        setAnthropometricCalculatorResult(result.data);
      } else {
        setError(JSON.parse(result.content));
        console.error(JSON.parse(result.content));
      }
    } else {
      setError("Des champs sont invalides.");
    }
    setOnSubmit(false);
  };

  return (
    <VStack>
      <AnthropometricCalcualtorForm
        formRef={formRef}
        handleSubmit={handleFormSubmit}
        onSubmit={onSubmit}
        error={error}
        onSucess={onSucess}
        submitBtnLabel="Calculer"
        submitBtnRightIcon="Calculator"
        schema={AnthropometricCalculatorFormSchema}
        zodSchema={AnthropometricCalculatorFormZodSchema}
      />
      {anthropometricCalculatorResult && (
        <FadeInCardY delayNumber={3}>
          <AnthropometricCalculatorResult
            results={anthropometricCalculatorResult}
          />
        </FadeInCardY>
      )}
    </VStack>
  );
};
