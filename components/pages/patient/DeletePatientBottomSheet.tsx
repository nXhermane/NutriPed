import React, { useEffect, useState } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
} from "@/components/ui/actionsheet";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { AlertTriangle } from "lucide-react-native";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { CardPressEffect } from "@/components/custom/motion";
import { AggregateID, Message } from "@/core/shared";
import { ScrollView } from "react-native";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { usePediatricApp } from "@/adapter";
import { useToast } from "@/src/context";
import { useDispatch } from "react-redux";
import { AppDispatch, deleteInteraction } from "@/src/store";
import { recordUiState } from "@/src/store/uiState";

type SelectedPatient = {
  name: string;
  id: AggregateID;
};
export interface DeletePatientBottomSheetProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedPatients: SelectedPatient[];
  onDeleteSucceed?: () => void;
}
export const DeletePatientBottomSheet: React.FC<
  DeletePatientBottomSheetProps
> = ({ selectedPatients, isOpen, onClose, onDeleteSucceed }) => {
  const [deletedPatients, setDeletedPatients] = useState<SelectedPatient[]>([]);
  const [isVivible, setIsVisisble] = useState<boolean>(false);
  const [onDeletion, setOnDeletion] = useState<boolean>(false);
  const { patientService } = usePediatricApp();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const handleOnClose = () => {
    onClose && onClose();
    setIsVisisble(false);
  };
  const handleOnDelete = async () => {
    setOnDeletion(true);
    const patientIds = deletedPatients.map(patient => patient.id);
    const deletePatientResults = await Promise.all(
      patientIds.map(id => patientService.delete({ id }))
    );
    if (deletePatientResults.some(res => res instanceof Message)) {
      toast.show(
        "Error",
        "Echec de suppression",
        "Suppression des patients selectionnés echouer. Veillez ressayer plutard."
      );
    } else {
      toast.show("Success", "Patients supprimés avec success.");
      patientIds.map(id => dispatch(deleteInteraction(id)));
      dispatch(recordUiState({ type: "PATIENT_DELETED" }));
      handleOnClose();
      onDeleteSucceed && onDeleteSucceed();
    }
    setOnDeletion(false);
  };

  useEffect(() => {
    setDeletedPatients(selectedPatients);
    if (selectedPatients.length === 0) handleOnClose();
  }, [selectedPatients]);
  useEffect(() => {
    setIsVisisble(isOpen as boolean);
  }, [isOpen]);

  return (
    <Actionsheet isOpen={isVivible} onClose={handleOnClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className={"border-0 bg-background-secondary px-0"}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className={"h-v-1 w-5 rounded-sm"} />
        </ActionsheetDragIndicatorWrapper>
        <VStack className={"max-h-[60vh] gap-4 px-4 pb-0 pt-v-4"}>
          <VStack className={"gap-2"}>
            <HStack className={"gap-3"}>
              <Icon as={AlertTriangle} className={"h-7 w-7 text-warning-500"} />
              <Heading className={"font-h3 text-xl text-red-500"}>
                Confirmer la suppression
              </Heading>
            </HStack>
            <Text className={"font-body text-sm text-typography-primary_light"}>
              Vous êtes sur le point de supprimer définitivement{" "}
              {deletedPatients.length}{" "}
              {deletedPatients.length === 1 ? "un patient" : "patients"}.
            </Text>
          </VStack>
          <VStack
            className={
              "gap-4 rounded-lg border-[1px] border-red-600/50 bg-red-600/10 p-4"
            }
          >
            <Center className={"h-9 w-9 rounded-full bg-red-500"}>
              <Icon as={AlertTriangle} className={"h-6 w-6 text-warning-500"} />
            </Center>
            <Text className={"font-body text-xs text-red-400"}>
              <Text bold className={"font-body text-xs text-red-400"}>
                Attention !
              </Text>{" "}
              Cette action est irréversible. Toutes les données associées aux
              patients selectionnés seront définitivement supprimées.
            </Text>
          </VStack>
          <ScrollView
            className={"h-fit"}
            contentContainerClassName={"gap-2 max-h-v-52"}
          >
            {deletedPatients.map((patient, index) => (
              <CardPressEffect
                key={index}
                onPress={() => {
                  setDeletedPatients(prev => {
                    return prev.filter(p => p.id != patient.id);
                  });
                }}
              >
                <HStack
                  className={
                    "items-center gap-4 rounded-lg bg-background-primary px-4 py-v-3"
                  }
                >
                  <Avatar className={"h-10 w-10 bg-green-300"}>
                    <AvatarFallbackText>{patient.name}</AvatarFallbackText>
                  </Avatar>
                  <Text className={"font-h4 text-base text-typography-primary"}>
                    {patient.name}
                  </Text>
                </HStack>
              </CardPressEffect>
            ))}
          </ScrollView>
          <HStack className={"justify-between"}>
            <Button
              className={"w-[40%] rounded-xl bg-green-500"}
              onPress={handleOnClose}
            >
              <ButtonText className={"font-h4 text-sm text-typography-900"}>
                Annuler
              </ButtonText>
            </Button>
            <Button
              className={"w-[40%] rounded-xl border-red-500 bg-red-600/10"}
              onPress={handleOnDelete}
              variant={"outline"}
            >
              {onDeletion && <ButtonSpinner />}
              <ButtonText className={"font-h4 text-sm text-red-500"}>
                Supprimer
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
