import {
  DynamicFormGenerator,
  FormHandler,
  Loading,
  useWizardStep,
} from "@/components/custom";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  useBiochemicalReference,
  useBiologicalInterpretationFormManager,
} from "@/src/hooks";
import { Plus } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { BiologicalInterpretationBiomakerSelectorModal } from "./BiologicalInterpretationBiomakerSelectorModal";

export interface GlobalDiagnosticBiologicalStepProps {}

export const GlobalDiagnosticBiologicalStep: React.FC<
  GlobalDiagnosticBiologicalStepProps
> = ({}) => {
  const { onPrev, onNext, data, error, setData, setError } = useWizardStep();
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
  const {
    data: biochemicalDtos,
    error: errorOnGetBiochemicalDtos,
    onLoading,
  } = useBiochemicalReference();

  const { formSchema, selectedBioMarker, zodValidation, setSelectedBioMarker } =
    useBiologicalInterpretationFormManager(biochemicalDtos, false);
  const dynamicFormRef = useRef<FormHandler<any>>(null);
  useEffect(() => {
    onNext(async e => {
      setError(null);
      setData(null);
      const data = await dynamicFormRef.current?.submit();
      if (data) {
        setData({
          formState: dynamicFormRef.current?.getState(),
          data: Object.values(data),
          selectedBioMarker,
        });
      } else {
        e.preventDefault();
        setError("Erreur de validation.");
      }
    });
    onPrev(e => {});
  }, [selectedBioMarker]);
  useEffect(() => {
    if (data) {
      setSelectedBioMarker(data.selectedBioMarker);
    }
  }, [data]);
  if (onLoading) return <Loading> Chargement... </Loading>;
  return (
    <React.Fragment>
      <VStack className="w-full flex-1 px-4">
        <VStack className="w-full flex-1 pt-5">
          <HStack className="mb-3 w-full items-center justify-between rounded-xl bg-background-secondary p-3">
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
              className="h-fit rounded-full bg-primary-c_light p-0 px-2 py-2"
              onPress={() => setShowSelectionModal(true)}
            >
              <ButtonIcon
                as={Plus}
                className="h-5 w-5 text-typography-primary"
              />
            </Button>
          </HStack>
          <VStack className="rounded-xl bg-background-secondary p-3">
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              {...(selectedBioMarker.length > 4 && {
                contentContainerClassName: "pb-16",
              })}
            >
              <DynamicFormGenerator
                schema={formSchema}
                zodSchema={zodValidation}
                ref={dynamicFormRef}
                className="p-0 px-0"
                initialState={data ? data.formState : undefined}
              />
            </KeyboardAwareScrollView>
          </VStack>
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
