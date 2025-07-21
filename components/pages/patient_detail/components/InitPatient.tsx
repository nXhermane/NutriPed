import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUI } from "@/src/context";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import colors from "tailwindcss/colors";
import {
  DiagnosticDataFormSchema,
  DiagnosticDataFormZodSchema,
} from "@/src/constants/ui";
import { HStack } from "@/components/ui/hstack";
import { Check, X } from "lucide-react-native";
import { useDiagnosticDataForm } from "@/src/hooks";
import { usePatientDetail } from "../context";

export interface InitPatientProps {}

export const InitPatient: React.FunctionComponent<InitPatientProps> = ({}) => {
  const [showInitBottomSheet, setShowInitBottomSheet] =
    useState<boolean>(false);
  const [triggerResolver, setTriggerResolver] = useState<{
    resolve: () => void;
  }>();

  return (
    <Center className="flex-1 bg-background-primary">
      <InitPatientTrigger
        onTrigger={async () => {
          return new Promise<void>(resolve => {
            setShowInitBottomSheet(true);
            setTriggerResolver({ resolve });
          });
        }}
      />
      <InitPatientBottomSheet
        isVisible={showInitBottomSheet}
        onClose={() => {
          triggerResolver?.resolve();
          setShowInitBottomSheet(false);
        }}
      />
    </Center>
  );
};

export interface InitPatientTriggerProps {
  onTrigger?: () => Promise<void>;
}

export const InitPatientTrigger: React.FC<InitPatientTriggerProps> = ({
  onTrigger,
}) => {
  const [onWaching, setOnWaching] = useState<boolean>(false);
  return (
    <VStack className="w-11/12 gap-v-3">
      <Text className="text-center font-body text-sm font-normal text-typography-primary dark:text-typography-primary_light">
        Avant de commencer l'évaluation nutritionnelle, veuillez saisir les
        données anthropométriques de base du patient (poids, taille, périmètre
        crânien, etc.).
      </Text>
      <Button
        className="bg-primary-c_light"
        onPress={async () => {
          setOnWaching(true);
          onTrigger && (await onTrigger());
          setOnWaching(false);
        }}
      >
        {onWaching ? (
          <ButtonSpinner color={"#fff"} size={"small"} />
        ) : (
          <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
            Saisir les données du patient
          </ButtonText>
        )}
      </Button>
    </VStack>
  );
};
export interface InitPatientBottomSheetProps {
  onClose?: () => void;
  isVisible?: boolean;
}
export const InitPatientBottomSheet: React.FC<InitPatientBottomSheetProps> = ({
  isVisible,
  onClose,
}) => {
  const {
    patient: { id: patientId },
  } = usePatientDetail();
  const { colorMode } = useUI();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const formRef = useRef<FormHandler<typeof DiagnosticDataFormSchema>>(null);
  const { onSubmit, error, onSucess, handleSubmit } = useDiagnosticDataForm(
    patientId,
    onClose ? onClose : () => {}
  );
  const handleFormSubmit = async () => {
    const data = await formRef.current?.submit();
    await handleSubmit(data as any);
  };

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheetModalProvider>
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
            <VStack
              {...props}
              className="rounded-2xl bg-background-secondary"
            />
          );
        }}
        enablePanDownToClose={true}
      >
        <VStack className="flex-1 pt-5">
          <KeyboardAwareScrollView
            ScrollViewComponent={BottomSheetScrollView as any}
            showsVerticalScrollIndicator={false}
          >
            <DynamicFormGenerator
              ref={formRef}
              schema={DiagnosticDataFormSchema}
              zodSchema={DiagnosticDataFormZodSchema as any}
            />
          </KeyboardAwareScrollView>
          <HStack className="w-full px-8 py-4">
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
                <></>
              )}
              <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
                Enregistrer et continuer
              </ButtonText>
              {onSucess && <ButtonIcon as={Check} className="text-white" />}
              {error && <ButtonIcon as={X} className="text-white" />}
            </Button>
          </HStack>
        </VStack>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
