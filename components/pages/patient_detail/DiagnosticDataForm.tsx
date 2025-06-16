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
import {
  APPETITE_TEST_PRODUCT_TYPE,
  APPETITE_TEST_SACHET_FRACTION_PARTITION,
} from "@/core/nutrition_care";
import { PatientDto } from "@/core/patient";
import { AggregateID, DateManager, Message } from "@/core/shared";
import {
  DiagnosticDataFormSchema,
  DiagnosticDataFormZodSchema,
  PATIENT_STATE,
} from "@/src/constants/ui";
import { useToast } from "@/src/context";
import { AppDispatch, recordInteraction } from "@/src/store";
import { Check, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useDispatch } from "react-redux";
export interface DiagnosticDataFormProps {
  patientId: AggregateID;
  onClose?: () => void;
  isOpen?: boolean;
}
export const DiagnosticDataForm: React.FunctionComponent<
  DiagnosticDataFormProps
> = ({ patientId, isOpen, onClose = () => void 0 }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [onSubmit, setOnSubmit] = useState<boolean>(false);
  const [onError, setOnError] = useState<boolean>(false);
  const [onSuccess, setOnSuccess] = useState<boolean>(false);
  const [isVisible, setIsVisisble] = useState<boolean>(false);
  const { diagnosticServices, medicalRecordService, patientService } =
    usePediatricApp();

  const toast = useToast();
  const dynamicFormRef =
    useRef<FormHandler<typeof DiagnosticDataFormSchema>>(null);

  const handleClose = () => {
    dynamicFormRef.current?.reset();
    dispatch(
      recordInteraction({
        patientId: patientId,
        date: new Date().toISOString(),
        state: PATIENT_STATE.NEW,
        isFirstVisitToPatientDetail: false,
      })
    );
    setOnError(false);
    setIsVisisble(false);
    setOnSuccess(false);
    setOnSubmit(false);
    onClose();
  };
  const handleSubmit = async () => {
    const formData = await dynamicFormRef.current?.submit();
    if (formData) {
      setOnSubmit(true);
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
        const nutritionalDiagnostic =
          await diagnosticServices.nutritionalDiagnostic.create({
            patientId: patientId,
            patientDiagnosticData: {
              sex: patientDto.gender,
              birthday: patientDto.birthday,
              anthropometricData: { anthropometricMeasures: [] },
              clinicalSigns: { clinicalSigns: [] },
              biologicalTestResults: [],
            },
          });

        if ("data" in nutritionalDiagnostic) {
          const addDataToMedicalRecord = await medicalRecordService.addData({
            medicalRecordId: patientId,
            data: {
              anthropometricData: anthroData.map(value => ({
                code: value.code,
                context: "admission",
                unit: value.unit,
                value: value.value,
                recordedAt: DateManager.formatDate(new Date()),
              })),
              biologicalData: [],
              clinicalData: clinicalData.clinicalSigns.map(clinicalSign => ({
                code: clinicalSign.code,
                data: clinicalSign.data,
                recordedAt: DateManager.formatDate(new Date()),
              })),
            },
          });
          if ("data" in addDataToMedicalRecord) {
            setOnSuccess(true);
            toast.show(
              "Success",
              "Données enregistrées",
              "Données initales enregistrées avec success vous pouvez effectuer un diagnostic."
            );
             handleClose();
          } else {
            setOnError(true);
            toast.show(
              "Error",
              "Erreur technique",
              "Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer dans quelques instants."
            );
           
          }
        } else {
          setOnError(true);
          setOnError(true);
          toast.show(
            "Error",
            "Erreur technique",
            "Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer dans quelques instants."
          );
        }
      }
    } else {
      setOnSubmit(false);
    }
  };

  useEffect(() => {
    setIsVisisble(isOpen as boolean);
  }, [isOpen]);
  return (
    <Actionsheet isOpen={isVisible}>
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
