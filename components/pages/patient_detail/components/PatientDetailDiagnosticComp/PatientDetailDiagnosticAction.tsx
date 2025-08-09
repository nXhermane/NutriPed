import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { useGenerateNutritionalDiagnostic } from "@/src/hooks";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { RotateCcw, StickyNote, View } from "lucide-react-native";
import { useState } from "react";
import { AddNoteToNutritionalDiagnosticModal } from "./AddNoteToNutritionalDiagnosticModal";
import { ShowPatientDiagnosticDataModal } from "./ShowPatientDiagnosticDataModal";

export interface PatientDetailDiagnosticActionProps {}

export const PatientDetailDiagnosticAction: React.FC<
  PatientDetailDiagnosticActionProps
> = ({}) => {
  const { error, generate, isSuccess, onLoading } =
    useGenerateNutritionalDiagnostic();
  const [showAddNoteModal, setShowAddNoteModal] = useState<boolean>(false);
  const [showPatientDataModal, setShowPatientDataModal] =
    useState<boolean>(false);
  return (
    <>
      <BottomSheetScrollView>
        <VStack className="gap-4 px-4 py-v-5">
          <Button
            className={`h-v-10 w-full rounded-xl ${error ? "bg-red-500" : "bg-primary-c_light"} data-[active=true]:text-white`}
            onPress={() => generate()}
          >
            {onLoading ? (
              <ButtonSpinner
                size={"small"}
                className="data-[active=true]:text-primary-c_light"
              />
            ) : (
              <>
                <ButtonIcon
                  className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light"
                  as={RotateCcw}
                />
                <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
                  Générer le diagnostic
                </ButtonText>
              </>
            )}
          </Button>
          <Button
            className="h-v-10 w-full rounded-xl bg-primary-c_light"
            onPress={() => setShowAddNoteModal(true)}
          >
            <ButtonIcon
              className="font-h4 font-medium text-white"
              as={StickyNote}
            />
            <ButtonText className="">Ajouter une note</ButtonText>
          </Button>
          <Button className="h-v-10 w-full rounded-xl bg-primary-c_light" onPress={() => {
            setShowPatientDataModal(true)
          }}>
            <ButtonIcon className="font-h4 font-medium text-white" as={View} />
            <ButtonText className="text-center">
              Afficher les données du patient
            </ButtonText>
          </Button>
        </VStack>
      </BottomSheetScrollView>
      <AddNoteToNutritionalDiagnosticModal
        isVisible={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
      />
      <ShowPatientDiagnosticDataModal
        isVisible={showPatientDataModal}
        onClose={() => {
          setShowPatientDataModal(false);
        }}
      />
    </>
  );
};
