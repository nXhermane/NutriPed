import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import {
  AddPatientFormSchema,
  AddPatientFormZodSchema,
  PATIENT_STATE,
} from "@/src/constants/ui";
import { usePediatricApp } from "@/adapter";
import { Message } from "@/core/shared";
import { emptyToUndefined } from "@/utils";
import { AppDispatch, recordInteraction } from "@/src/store";
import { useDispatch } from "react-redux";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Check, X } from "lucide-react-native";
import { useToast } from "@/src/context";
import { recordUiState } from "@/src/store/uiState";

export interface AddPatientBottomSheetProps {
  isOpen?: boolean;
  onClose?: () => void;
}
export const AddPatientBottomSheet: React.FC<AddPatientBottomSheetProps> = ({
  isOpen,
  onClose = () => void 0,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isVisible, setIsVisisble] = useState<boolean>(false);
  const { patientService } = usePediatricApp();
  const toast = useToast();
  const dynamicFormRef = useRef<FormHandler<typeof AddPatientFormSchema>>(null);
  const [onSubmit, setOnSubmit] = useState<boolean>(false);
  const [onError, setOnError] = useState<boolean>(false);
  const [onSuccess, setOnSuccess] = useState<boolean>(false);

  const handleClose = () => {
    dynamicFormRef.current?.reset();
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
      const createPatientData = {
        name: formData.fullName,
        gender: formData.gender,
        birthday: formData.birthDate,
        address: {
          country: emptyToUndefined(formData.country),
          city: emptyToUndefined(formData.city),
          postalCode: emptyToUndefined(formData.postalCode),
          street: emptyToUndefined(formData.street),
        },
        contact: {
          email: emptyToUndefined(formData.email),
          tel: emptyToUndefined(formData.phone),
        },
        parents: {
          father: emptyToUndefined(formData.fatherName),
          mother: emptyToUndefined(formData.motherName),
        },
      };
      const result = await patientService.create({ data: createPatientData });
      if (result instanceof Message) {
        setOnError(true);
        toast.show(
          "Error",
          "Erreur technique",
          "Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer dans quelques instants."
        );
      } else {
        setOnSuccess(true);
        toast.show(
          "Success",
          "Patient enregistré",
          `Les informations de ${formData.fullName} ont été sauvegardées avec succès`
        );
        dispatch(
          recordInteraction({
            patientId: result.data.id,
            date: new Date().toISOString(),
            state: PATIENT_STATE.NEW,
            isFirstVisitToPatientDetail: true,
          })
        );
        dispatch(recordUiState({ type: "PATIENT_ADDED" }));
        handleClose();
      }
    } else {
      setOnSubmit(false);
    }
  };

  useEffect(() => {
    setIsVisisble(isOpen as boolean);
  }, [isOpen]);
  return (
    <Actionsheet isOpen={isVisible} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className={"border-0 bg-background-secondary px-0"}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className={"h-v-1 w-5 rounded-sm"} />
        </ActionsheetDragIndicatorWrapper>
        <VStack className={"h-[85vh] w-full"}>
          <HStack className={"w-full items-center justify-between px-4 py-v-3"}>
            <Heading
              className={
                "font-h2 text-2xl font-semibold text-typography-primary"
              }
            >
              Nouveau Patient
            </Heading>
            <Button
              className={`h-v-6 rounded-lg bg-primary-c_light px-4 ${onError ? "bg-red-500" : ""}`}
              onPress={handleSubmit}
            >
              {onSubmit && <ButtonSpinner className="" />}
              {onError && <Icon as={X} className="text-white" />}
              <ButtonText
                className={"font-body text-xs font-normal text-white"}
              >
                Ajouter
              </ButtonText>
              {onSuccess && <Icon as={Check} className="text-white" />}
            </Button>
          </HStack>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <DynamicFormGenerator
              ref={dynamicFormRef}
              schema={AddPatientFormSchema}
              zodSchema={AddPatientFormZodSchema}
            />
          </KeyboardAwareScrollView>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
