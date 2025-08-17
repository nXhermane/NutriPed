import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React, { useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { DynamicFormGenerator } from "@/components/custom";
import {
  AddPatientFormSchema,
  AddPatientFormZodSchema,
  PATIENT_STATE,
} from "@/src/constants/ui";
import { AppDispatch, recordInteraction } from "@/src/store";
import { useDispatch } from "react-redux";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Check, X } from "lucide-react-native";
import { useToast, useUI } from "@/src/context";
import { recordUiState } from "@/src/store/uiState";
import { useAddPatientFormHandle } from "@/src/hooks";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import colors from "tailwindcss/colors";
import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";

export interface AddPatientBottomSheetProps {
  isVisible?: boolean;
  onClose?: () => void;
}
export const AddPatientBottomSheet: React.FC<AddPatientBottomSheetProps> = ({
  isVisible,
  onClose = () => void 0,
}) => {
  const { addedPatientInfo, error, formRef, handle, onSubmit, onSuccess } =
    useAddPatientFormHandle();
  const { colorMode } = useUI();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();

  React.useEffect(() => {
    console.log("Hello he work properly");
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isVisible]);

  useEffect(() => {
    if (onSuccess && addedPatientInfo) {
      toast.show(
        "Success",
        "Patient enregistré",
        `Les informations de ${addedPatientInfo.fullname} ont été sauvegardées avec succès`
      );
      dispatch(
        recordInteraction({
          patientId: addedPatientInfo.id,
          date: new Date().toISOString(),
          state: PATIENT_STATE.NEW,
          isFirstVisitToPatientDetail: true,
        })
      );
      dispatch(recordUiState({ type: "PATIENT_ADDED" }));
      onClose && onClose();
    }
  }, [addedPatientInfo, onSuccess]);

  useEffect(() => {
    if (error)
      toast.show(
        "Error",
        "Erreur technique",
        "Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer dans quelques instants."
      );
  }, [error]);

  return (
    <BottomSheetModal
      onDismiss={() => onClose && onClose()}
      snapPoints={["60%"]}
      ref={bottomSheetModalRef}
      handleIndicatorStyle={{
        backgroundColor:
          colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
      }}
      handleComponent={props => <BottomSheetDragIndicator {...props} />}
      backgroundComponent={props => {
        return (
          <VStack {...props} className="rounded-2xl bg-background-secondary" />
        );
      }}
      enablePanDownToClose={true}
    >
      <VStack className="flex-1 bg-background-primary">
        <VStack className="px-7">
          <Heading className="font-h3 text-xl font-semibold text-typography-primary">
            Ajouter un nouveau patient
          </Heading>
          <Text className="font-body text-xs text-typography-primary_light">
            Ajouter un patient afin de commencer son diagnostic, sa prise en
            charge et son suivi.
          </Text>
        </VStack>
        <KeyboardAwareScrollView
          ScrollViewComponent={BottomSheetScrollView as any}
          showsVerticalScrollIndicator={false}
        >
          <DynamicFormGenerator
            ref={formRef}
            schema={AddPatientFormSchema}
            zodSchema={AddPatientFormZodSchema}
          />
        </KeyboardAwareScrollView>
        <HStack className="w-full px-8 py-4">
          <Button
            className={`h-v-10 w-full rounded-xl data-[active=true]:bg-white ${error ? "bg-red-500" : "bg-primary-c_light"}`}
            onPress={handle}
          >
            {onSubmit ? (
              <ButtonSpinner
                size={"small"}
                className="data-[active=true]:text-primary-c_light"
              />
            ) : (
              <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
                Enregister le patient
              </ButtonText>
            )}

            {onSuccess && <ButtonIcon as={Check} className="text-white" />}
            {error && <ButtonIcon as={X} className="text-white" />}
          </Button>
        </HStack>
      </VStack>
    </BottomSheetModal>
  );
};
