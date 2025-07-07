import React, { useCallback, useRef, useState } from "react";
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
import { Text } from "react-native";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Calculator, Check, X } from "lucide-react-native";
import { ScrollView } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { View } from "@/components/ui/view";
import { BlurView } from "expo-blur";
import { useUI } from "@/src/context";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import colors from "tailwindcss/colors";
import {
  BottomSheetDragIndicator,
  BottomSheetScrollView,
} from "@/components/ui/bottomsheet";

export const AnthropometricCalculatorPanel = ({}) => {
  const {
    diagnosticServices: { growthIndicatorValue },
  } = usePediatricApp();
  const { colorMode } = useUI();
  const [anthropometricCalculatorResult, setAnthropometricCalculatorResult] =
    useState<GrowthIndicatorValueDto[] | null>(null);
  const formRef =
    useRef<FormHandler<typeof AnthropometricCalculatorFormSchema>>(null);
  const [onSubmit, setOnSubmit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [onSucess, setOnSucess] = useState<boolean>(false);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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
        bottomSheetModalRef.current?.present();
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
    <React.Fragment>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="pb-16">
          <AnthropometricCalcualtorForm
            formRef={formRef}
            schema={AnthropometricCalculatorFormSchema}
            zodSchema={AnthropometricCalculatorFormZodSchema}
          />
        </VStack>
      </ScrollView>
      <HStack className="absolute bottom-0 w-full overflow-hidden rounded-xl">
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={50}
          tint={colorMode}
          className="w-full px-8 py-4"
        >
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
              <ButtonIcon as={Calculator} className="text-typography-primary" />
            )}
            <ButtonText className="font-h4 font-medium text-typography-primary data-[active=true]:text-primary-c_light">
              Calculer
            </ButtonText>
            {onSucess && (
              <ButtonIcon as={Check} className="text-typography-primary" />
            )}
            {error && <ButtonIcon as={X} className="text-typography-primary" />}
          </Button>
        </BlurView>
      </HStack>

      <BottomSheetModalProvider>
        <BottomSheetModal
          onDismiss={() => {
            bottomSheetModalRef.current?.close();
          }}
          snapPoints={['60%']}
          ref={bottomSheetModalRef}
          handleIndicatorStyle={{
            backgroundColor:
              colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
          }}
          handleComponent={props => <BottomSheetDragIndicator {...props} />}
          backgroundComponent={props => {
            return (
              <VStack
                {...props}
                className="rounded-2xl bg-background-primary"
              />
            );
          }}
          enablePanDownToClose={true}
        >
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            {anthropometricCalculatorResult && (
              <FadeInCardY delayNumber={3}>
                <AnthropometricCalculatorResult
                  results={anthropometricCalculatorResult}
                />
              </FadeInCardY>
            )}
          </BottomSheetScrollView>
          
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </React.Fragment>
  );
};
