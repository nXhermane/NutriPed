import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { useUI } from "@/src/context";
import {
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import colors from "tailwindcss/colors";
import {
  DiagnosticDataFormSchema,
  DiagnosticDataFormZodSchema,
} from "@/src/constants/ui";
import { HStack } from "@/components/ui/hstack";
import { Check, X } from "lucide-react-native";
import { useDiagnosticDataForm } from "@/src/hooks";
import { usePatientDetail } from "@/src/context/pages";
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
  );
};
