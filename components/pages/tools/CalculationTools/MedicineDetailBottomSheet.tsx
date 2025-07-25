import { usePediatricApp } from "@/adapter";
import {
  DynamicFormGenerator,
  FormHandler,
  Loading,
} from "@/components/custom";
import { FadeInCardY } from "@/components/custom/motion";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetScrollView,
} from "@/components/ui/actionsheet";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { AnthroSystemCodes } from "@/core/constants";
import { MedicineDosageResultDto, MedicineDto } from "@/core/nutrition_care";
import {
  MedicineDosageFormSchema,
  MedicineDosageFormZodSchema,
} from "@/src/constants/ui";
import { useToast, useUI } from "@/src/context";
import { Calculator } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { MedicineDosageResult } from "./MedicineDosageResult";

export interface MedicineDetailBottomSheetProps {
  isOpen?: boolean;
  medicineDto: MedicineDto;
  onClose?: () => void;
}

export const MedicineDetailBottomSheet: React.FC<
  MedicineDetailBottomSheetProps
> = ({ isOpen, medicineDto, onClose }) => {
  const toast = useToast();
  const { colorMode } = useUI();
  const {
    nutritionCareServices: { medicine },
  } = usePediatricApp();
  const formRef = useRef<FormHandler<typeof MedicineDosageFormSchema>>(null);
  const [medicineDosageResult, setMedicineDosageResult] =
    useState<MedicineDosageResultDto | null>(null);
  const [onComputing, setOnComputing] = useState<boolean>(false);
  const onSubmit = async () => {
    setOnComputing(true);
    setMedicineDosageResult(null);
    const data = await formRef.current?.submit();
    if (data) {
      const result = await medicine.getDosage({
        medicineId: medicineDto.id,
        patientWeightInKg: data[AnthroSystemCodes.WEIGHT],
      });
      if ("data" in result) {
        setMedicineDosageResult(result.data);
      } else {
        const error = JSON.parse(result.content);
        console.error(error);
        toast.show("Error", "Erreur technique", "Veillez reessayer");
      }
    }
    setOnComputing(false);
  };
  return (
    <React.Fragment>
      <Actionsheet isOpen={isOpen} onClose={onClose && onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className={"border-0 bg-background-primary px-0"}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className={"h-v-1 w-5 rounded-sm"} />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetScrollView
            className="max-h-[85vh]"
            showsVerticalScrollIndicator={false}
          >
            <VStack className={"w-full"}>
              <HStack className="items-center px-2 py-4">
                <Heading className="w-full text-center font-h4 text-lg font-medium text-typography-primary">
                  {medicineDto.name}
                </Heading>
              </HStack>
              <VStack className="mx-4 gap-4 rounded-xl border-[1px] border-primary-border/5 bg-background-secondary px-3 py-3">
                <KeyboardAwareScrollView>
                  <DynamicFormGenerator
                    schema={MedicineDosageFormSchema}
                    zodSchema={MedicineDosageFormZodSchema}
                    ref={formRef}
                    className="p-0 px-0"
                  />
                </KeyboardAwareScrollView>
                <Button
                  className="h-v-10 rounded-xl bg-primary-c_light"
                  onPress={onSubmit}
                >
                  <ButtonIcon as={Calculator} className="text-white" />
                  <ButtonText className="font-h4 font-medium text-white">
                    {"Calculer le dosage"}
                  </ButtonText>
                </Button>
              </VStack>
              {onComputing && <Loading>Calcul en cours...</Loading>}
              {medicineDosageResult != null && (
                <FadeInCardY delayNumber={3}>
                  <MedicineDosageResult
                    name={medicineDto.name}
                    result={medicineDosageResult}
                    warnings={medicineDto.warnings}
                    interactions={medicineDto.interactions}
                    notes={medicineDto.notes}
                  />
                </FadeInCardY>
              )}
            </VStack>
          </ActionsheetScrollView>
        </ActionsheetContent>
      </Actionsheet>
    </React.Fragment>
  );
};
