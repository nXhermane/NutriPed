import React, { useRef, useState } from "react";
import { AnthropometricCalcualtorForm } from "./AnthropometicCalculatorForm";
import {
  AnthropometricCalculatorFormSchema,
  AnthropometricCalculatorFormZodSchema,
} from "@/src/constants/ui";
import { FakeBlur, FormHandler } from "@/components/custom";
import { usePediatricApp } from "@/adapter";
import {
  CalculateAllAvailableGrowthIndicatorValueRequest,
  GrowthIndicatorValueDto,
} from "@/core/evaluation";
import { VStack } from "@/components/ui/vstack";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Calculator, Check, X } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { AnthropometricCalculatorResultModal } from "./AnthropometricCalculatorResultModal";
import { AnthropometricCalculatorSavingLabelModal } from "./AnthropometricCalculatorSavedLabelModal";
import { useDispatch } from "react-redux";
import { addAnthropometricCalculatorResult } from "@/src/store";
import { usePicker } from "@/src/hooks";

const AnthropometricCalculatorPanelComponent = () => {
  const {
    diagnosticServices: { growthIndicatorValue },
  } = usePediatricApp();
  const dispatch = useDispatch();
  const { closePicker, isOpen, openPicker } = usePicker<{ label: string }>();

  const formRef =
    useRef<FormHandler<typeof AnthropometricCalculatorFormSchema>>(null);

  // États pour le calcul
  const [anthropometricCalculatorResult, setAnthropometricCalculatorResult] =
    useState<GrowthIndicatorValueDto[] | null>(null);
  const [anthropometricCalulatorUsedData, setAnthropometricCalculatorUsedData] =
    useState<CalculateAllAvailableGrowthIndicatorValueRequest | null>(null);
  const [onSubmit, setOnSubmit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [onSucess, setOnSucess] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const handleFormSubmit = React.useCallback(async () => {
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
      const request = {
        age_in_day,
        age_in_month,
        sex,
        anthropometricData: { anthropometricMeasures },
      };

      const result =
        await growthIndicatorValue.calculateAllAvailableIndicator(request);
      if ("data" in result) {
        setOnSucess(true);
        setAnthropometricCalculatorUsedData(request);
        setAnthropometricCalculatorResult(result.data);
        setShowResultModal(true);
      } else {
        setError(JSON.parse(result.content));
        console.error(JSON.parse(result.content));
      }
    } else {
      setError("Des champs sont invalides.");
    }
    setOnSubmit(false);
  }, [growthIndicatorValue]);
  const handleSaveResult = React.useCallback(async () => {
    const label = await openPicker();
    if (
      label &&
      anthropometricCalculatorResult &&
      anthropometricCalulatorUsedData
    ) {
      dispatch(
        addAnthropometricCalculatorResult({
          name: label.label,
          result: anthropometricCalculatorResult,
          usedData: {
            age_in_day: anthropometricCalulatorUsedData.age_in_day,
            age_in_month: anthropometricCalulatorUsedData.age_in_month,
            sex: anthropometricCalulatorUsedData.sex,
            anthropometricData:
              anthropometricCalulatorUsedData.anthropometricData
                .anthropometricMeasures,
          },
        })
      );
      setShowResultModal(false);
    }
  }, [
    openPicker,
    anthropometricCalculatorResult,
    anthropometricCalulatorUsedData,
    addAnthropometricCalculatorResult,
  ]);

  return (
    <React.Fragment>
      <VStack className="bg-background-primary pb-16">
        <AnthropometricCalcualtorForm
          formRef={formRef}
          schema={AnthropometricCalculatorFormSchema}
          zodSchema={AnthropometricCalculatorFormZodSchema}
        />
      </VStack>
      <HStack className="absolute bottom-0 w-full overflow-hidden rounded-xl">
        <FakeBlur className="w-full px-8 py-4">
          <Button
            className={`h-v-10 w-full rounded-xl ${error ? "bg-red-500" : "bg-primary-c_light"}`}
            onPress={handleFormSubmit}
          >
            {onSubmit ? (
              <ButtonSpinner
                size={"small"}
                className="data-[active=true]:text-primary-c_light"
              />
            ) : (
              <ButtonIcon as={Calculator} className="text-white" />
            )}
            <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
              Calculer
            </ButtonText>
            {onSucess && <ButtonIcon as={Check} className="text-white" />}
            {error && <ButtonIcon as={X} className="text-white" />}
          </Button>
        </FakeBlur>
      </HStack>

      <AnthropometricCalculatorResultModal
        isVisible={showResultModal}
        results={anthropometricCalculatorResult}
        onClose={() => setShowResultModal(false)}
        onSave={handleSaveResult}
      />

      <AnthropometricCalculatorSavingLabelModal
        isOpen={isOpen}
        onClose={value => {
          closePicker(value);
        }}
      />
    </React.Fragment>
  );
};

export const AnthropometricCalculatorPanel =
  AnthropometricCalculatorPanelComponent;
