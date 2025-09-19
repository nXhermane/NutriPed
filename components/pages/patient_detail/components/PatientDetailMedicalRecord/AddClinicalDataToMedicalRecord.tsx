import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { useClinicalReference } from "@/src/hooks";
import React, { useState } from "react";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react-native";
import { ClinicalSignReferenceDto } from "@/core/evaluation";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { AddClinicalDataToMedicalRecordClinicalSignSelectorModal } from "./AddClinicalDataToMedicalRecordClinicalSignSelectorModal";
import { AddClinicalDataToMedicalRecordForm } from "./AddClinicalDataToMedicalRecordForm";

export interface AddClinicalDataToMedicalRecordProps {}

export const AddClinicalDataToMedicalRecord: React.FC<
  AddClinicalDataToMedicalRecordProps
> = ({}) => {
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(true);
  const { data, onLoading, error } = useClinicalReference();
  const [selectedClinicalSigns, setSelectedClinicalSigns] = useState<
    ClinicalSignReferenceDto[]
  >([]);

  return (
    <VStack className="flex-1 bg-background-primary px-2 pb-v-2">
      {showSelectionModal && (
        <VStack>
          <HStack className="mb-3 mt-2 w-full items-center justify-between rounded-xl bg-background-secondary p-3">
            <VStack className="w-[80%]">
              <Heading className="font-h4 text-lg font-medium text-typography-primary">
                Selection de signe clinique
              </Heading>
              <Text className="font-body text-xs font-normal text-typography-primary_light">
                Vous devez selectionner les signes cliniques que vous voulez
                observer chez patient.
              </Text>
            </VStack>
            <Button
              isDisabled={selectedClinicalSigns.length == 0}
              className={`h-fit rounded-full bg-primary-c_light p-0 px-2 py-2`}
              onPress={() => {
                setShowSelectionModal(false);
              }}
            >
              <ButtonIcon as={Plus} className="h-5 w-5 text-white" />
            </Button>
          </HStack>
        </VStack>
      )}
      {showSelectionModal && (
        <AddClinicalDataToMedicalRecordClinicalSignSelectorModal
          data={data}
          selectedClinicalSigns={selectedClinicalSigns}
          onSelect={sign => {
            setSelectedClinicalSigns(prev => {
              if (prev.includes(sign))
                return prev.filter(val => val.id != sign.id);
              else {
                return [...prev, sign];
              }
            });
          }}
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
          <AddClinicalDataToMedicalRecordForm data={selectedClinicalSigns} />
        </VStack>
      )}
    </VStack>
  );
};
