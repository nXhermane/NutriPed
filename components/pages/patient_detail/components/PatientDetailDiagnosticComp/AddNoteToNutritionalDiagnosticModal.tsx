import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import { useUI } from "@/src/context";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import colors from "tailwindcss/colors";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { FormField } from "@/components/custom/FormField";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Save } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { usePediatricApp } from "@/adapter";
import { Guard } from "@/core/shared";
import { usePatientDetail } from "@/src/context/pages";
import { uiBus } from "@/uiBus";

export interface AddNoteToNutritionalDiagnosticModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export const AddNoteToNutritionalDiagnosticModal: React.FC<
  AddNoteToNutritionalDiagnosticModalProps
> = ({ isVisible = false, onClose = () => void 0 }) => {
  const {
    diagnosticServices: { nutritionalDiagnostic },
  } = usePediatricApp();
const { patient } = usePatientDetail();
const { colorMode } = useUI();
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handleSubmit = async () => {
    setError(undefined);
    if (Guard.isEmpty(note).succeeded) {
      setError("La note à ajouter ne peut étre vide.");
      return;
    }
    const result = await nutritionalDiagnostic.addNotes({
      nutritionalDiagnosticId: patient.id,
      notes: [
        {
          content: note,
          date: String(new Date().getTime()),
        },
      ],
    });
    if ("data" in result) {
      setNote("");
      uiBus.emit("nutritional:diagnostic:update");
      bottomSheetModalRef.current?.close();
    } else {
      const _errorContent = JSON.parse(result.content);
      console.error(_errorContent);
      setError(_errorContent);
    }
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
      onDismiss={() => {
        onClose();
      }}
      snapPoints={["50%"]}
      ref={bottomSheetModalRef}
      handleIndicatorStyle={{
        backgroundColor:
          colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
      }}
      handleComponent={props => <BottomSheetDragIndicator {...props} />}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
      backgroundComponent={props => {
        return (
          <VStack {...props} className="rounded-2xl bg-background-primary" />
        );
      }}
      enablePanDownToClose={true}
    >
      <VStack className="px-4 py-v-4">
        <HStack className="items-center justify-center">
          <Text className="font-h3 text-lg font-semibold text-typography-primary">
            Ajouter une note
          </Text>
        </HStack>
        <KeyboardAwareScrollView
          ScrollViewComponent={BottomSheetScrollView as any}
          showsVerticalScrollIndicator={false}
        >
          <FormField
            field={{
              type: "textarea",
              default: "",
              label: "",
              name: "note",
              placeholder: "Saisir votre note ici...",
            }}
            error={error}
            value={note}
            onChange={(field, value) => setNote(value)}
          />

          <Button
            onPress={handleSubmit}
            className="h-v-10 w-full rounded-xl bg-primary-c_light"
          >
            <ButtonIcon className="font-h4 font-medium text-white" as={Save} />
            <ButtonText className="text-center">Enregistrer</ButtonText>
          </Button>
        </KeyboardAwareScrollView>
      </VStack>
    </BottomSheetModal>
  );
};
