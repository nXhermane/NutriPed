import { usePediatricApp } from "@/adapter";
import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import {
  AnthroSystemCodes,
  CLINICAL_SIGNS,
  OBSERVATIONS,
} from "@/core/constants";
import { PatientDto } from "@/core/patient";
import { AggregateID, Message } from "@/core/shared";
import {
  DiagnosticDataFormSchema,
  DiagnosticDataFormZodSchema,
} from "@/src/constants/ui";
import { Check, X } from "lucide-react-native";
import { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
export interface DiagnosticDataFormProps {
  patientId: AggregateID;
}
export const DiagnosticDataForm: React.FunctionComponent<
  DiagnosticDataFormProps
> = ({ patientId }) => {
  const [onSubmit, setOnSubmit] = useState<boolean>(false);
  const [onError, setOnError] = useState<boolean>(false);
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const { diagnosticServices, medicalRecordService, patientService } =
    usePediatricApp();
  const dynamicFormRef =
    useRef<FormHandler<typeof DiagnosticDataFormSchema>>(null);
  const handleSubmit = async () => {
    const nutritionalDiagnosticData =
      await diagnosticServices.nutritionalDiagnostic.generateDiagnosticResult({
        nutritionalDiagnosticId: patientId 
      });
    if(!(nutritionalDiagnosticData instanceof Message)) {
      console.log(nutritionalDiagnosticData.data.growthIndicatorValues)
    }
    const formData = await dynamicFormRef.current?.submit();
    if (formData) {
      const allEntries = Object.entries(formData).filter(
        ([, val]) => val != undefined
      );
      const anthroData = allEntries
        .filter(([key]) =>
          [
            AnthroSystemCodes.WEIGHT,
            AnthroSystemCodes.LENGTH,
            AnthroSystemCodes.HEIGHT,
            AnthroSystemCodes.HEAD_CIRCUMFERENCE,
            AnthroSystemCodes.SSF,
            AnthroSystemCodes.MUAC,
            AnthroSystemCodes.TSF,
          ].includes(key as AnthroSystemCodes)
        )
        .map(([, val]) => val);

      const clinicalData = {
        clinicalSigns: [
          {
            code: CLINICAL_SIGNS.EDEMA,
            data: {
              [OBSERVATIONS.EDEMA_PRESENCE]: true,
              [OBSERVATIONS.EDEMA_GODET_COUNT]: 2,
            },
          },
        ],
      };
      const patientRes = await patientService.get({ id: patientId });
      if (!(patientRes instanceof Message)) {
        const patientDto = patientRes.data[0] as PatientDto;
       
          // const nutritionalDiagnostic =
          //   await diagnosticServices.nutritionalDiagnostic.create({
          //     patientId: patientId,
          //     patientDiagnosticData: {
          //       sex: patientDto.gender,
          //       birthday: patientDto.birthday,
          //       anthropometricData: { anthropometricMeasures: anthroData },
          //       clinicalSigns: clinicalData,
          //       biologicalTestResults: [],
          //     },
          //   });
          // console.log(nutritionalDiagnostic);
     
      }
    }
  };
  return (
    <Actionsheet isOpen>
      <ActionsheetBackdrop />
      <ActionsheetContent className={"border-0 bg-background-secondary px-0"}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className={"h-v-1 w-5 rounded-sm"} />
        </ActionsheetDragIndicatorWrapper>
        <VStack className={"h-[85vh] w-full"}>
          <HStack className={"w-full items-center justify-between px-4 py-v-3"}>
            <Heading className={"font-h2 text-xl text-typography-primary"}>
              Donnée de diagnostic
            </Heading>
            <Button
              className={`h-v-6 rounded-lg bg-primary-c_light px-4 ${onError ? "bg-red-500" : ""}`}
              onPress={handleSubmit}
            >
              {onSubmit && <ButtonSpinner />}
              {onError && <Icon as={X} />}
              <ButtonText
                className={"font-body text-xs text-typography-primary"}
              >
                Enregistrer
              </ButtonText>
              {onSuccess && <Icon as={Check} />}
            </Button>
          </HStack>
          <KeyboardAwareScrollView>
            <DynamicFormGenerator
              schema={DiagnosticDataFormSchema}
              zodSchema={DiagnosticDataFormZodSchema}
              ref={dynamicFormRef}
            />
          </KeyboardAwareScrollView>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
