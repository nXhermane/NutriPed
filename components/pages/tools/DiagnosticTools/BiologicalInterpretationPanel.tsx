import { DynamicFormGenerator } from "@/components/custom";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { BiochemicalReferenceDto } from "@/core/diagnostics";
import { useBiologicalInterpretationFormManager } from "@/src/hooks";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { BiologicalInterpretationBiomakerSelectorModal } from "./BiologicalInterpretationBiomakerSelectorModal";

export interface BiologicalInterpretationPanelProps {
  biochemicalDtos?: BiochemicalReferenceDto[];
}

export const BiologicalInterpretationPanel: React.FC<
  BiologicalInterpretationPanelProps
> = ({ biochemicalDtos }) => {
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
  const { formSchema, selectedBioMarker, setSelectedBioMarker } =
    useBiologicalInterpretationFormManager(biochemicalDtos);
  return (
    <React.Fragment>
      <VStack className="w-full flex-1 pt-5">
        <HStack className="w-full items-center justify-between bg-red-500">
          <Heading>Ajouter un marqueur</Heading>
          <Button onPress={() => setShowSelectionModal(true)}>
            <ButtonText>Ajouter</ButtonText>
          </Button>
        </HStack>
        <VStack className="rounded-xl bg-background-secondary p-3">
          <KeyboardAwareScrollView>
            <DynamicFormGenerator schema={formSchema} className="p-0 px-0" />
          </KeyboardAwareScrollView>
        </VStack>
      </VStack>
      <BiologicalInterpretationBiomakerSelectorModal
        biomarkers={biochemicalDtos ?? []}
        isVisible={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        selectedBiomarkers={selectedBioMarker}
        onSelect={id => {
          setSelectedBioMarker(prev => {
            if (prev.includes(id)) return prev.filter(val => val != id);
            else {
              return [...prev, id];
            }
          });
        }}
      />
    </React.Fragment>
  );
};
