import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react-native";
import {
  useBiochemicalReference,
  useBiologicalInterpretationFormManager,
} from "@/src/hooks";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { AddBiologicalDataToMedicalRecordBioRefSelectorModal } from "./AddBiologicalDataToMedicalRecordBioRefSelectorModal";
import { AddBiologicalDataToMedicalRecordForm } from "./AddBiologicalDataToMedicalRecordForm";

export interface AddBiologicalDataToMedicalRecordProps {}

export const AddBiologicalDataToMedicalRecord: React.FC<
  AddBiologicalDataToMedicalRecordProps
> = ({}) => {
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(true);
  const { data: bioRefDtos, error, onLoading } = useBiochemicalReference();
  const { formSchema, selectedBioMarker, zodValidation, setSelectedBioMarker } =
    useBiologicalInterpretationFormManager(bioRefDtos, false);

  return (
    <VStack className="flex-1 bg-background-primary px-2">
      {showSelectionModal && (
        <HStack className="mb-3 mt-3 w-full items-center justify-between rounded-xl bg-background-secondary p-3">
          <VStack className="w-[80%]">
            <Heading className="font-h4 text-lg font-medium text-typography-primary">
              Ajouter un marqueur
            </Heading>
            <Text className="font-body text-xs font-normal text-typography-primary_light">
              Vous devez ajouter les marqueurs biologiques que vous voulez
              analyser ou interpreter
            </Text>
          </VStack>
          <Button
            isDisabled={selectedBioMarker.length === 0}
            className="h-fit rounded-full bg-primary-c_light p-0 px-2 py-2"
            onPress={() => setShowSelectionModal(false)}
          >
            <ButtonIcon as={Plus} className="h-5 w-5 text-white" />
          </Button>
        </HStack>
      )}
      {showSelectionModal && (
        <AddBiologicalDataToMedicalRecordBioRefSelectorModal
          selectedBioMarker={selectedBioMarker}
          onSelect={id => {
            setSelectedBioMarker(prev => {
              if (prev.includes(id)) return prev.filter(val => val != id);
              else {
                return [...prev, id];
              }
            });
          }}
          data={bioRefDtos}
        />
      )}
      {!showSelectionModal && (
        <VStack className="bg-background-primary">
          <HStack>
            <Pressable
              onPress={() => {
                setShowSelectionModal(true);
              }}
              className={"flex-row"}
            >
              <Icon as={ArrowLeft} className="h-5 w-5" />
              <Text className="text-typography-primary">Retour</Text>
            </Pressable>
          </HStack>
          <AddBiologicalDataToMedicalRecordForm
            schema={formSchema}
            zodValidation={zodValidation}
          />
        </VStack>
      )}
    </VStack>
  );
};
