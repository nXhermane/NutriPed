import {
  DynamicFormGenerator,
  FakeBlur,
  FormHandler,
} from "@/components/custom";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import {
  BiochemicalReferenceDto,
  BiologicalAnalysisInterpretationDto,
  BiologicalTestResult,
} from "@/core/diagnostics";
import { useBiologicalInterpretationFormManager } from "@/src/hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { BiologicalInterpretationBiomakerSelectorModal } from "./BiologicalInterpretationBiomakerSelectorModal";
import { Check, Microscope, Plus, X } from "lucide-react-native";
import { usePediatricApp } from "@/adapter";
import { useToast } from "@/src/context";
import { BiologicalInterpretationResultModal } from "./BiologicalInterpretationResultModal";

export interface BiologicalInterpretationPanelProps {
  biochemicalDtos?: BiochemicalReferenceDto[];
}

export const BiologicalInterpretationPanel: React.FC<
  BiologicalInterpretationPanelProps
> = ({ biochemicalDtos }) => {
  const toast = useToast();
  const {
    diagnosticServices: { biologicalAnalysis },
  } = usePediatricApp();
  const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
  const { formSchema, selectedBioMarker, zodValidation, setSelectedBioMarker } =
    useBiologicalInterpretationFormManager(biochemicalDtos);
  const dynamicFormRef = useRef<FormHandler<any>>(null);
  const [error, setError] = useState<string | null>(null);
  const [onSubmit, setOnSubmit] = useState<boolean>(false);
  const [onSucess, setOnSucess] = useState<boolean>(false);
  const [biologicalInterpretationResults, setBiologicalInterpretationResults] =
    useState<BiologicalAnalysisInterpretationDto[]>([]);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const handleSubmitForm = useCallback(async () => {
    setOnSubmit(true);
    setError(null);
    setOnSucess(false);
    const data = await dynamicFormRef.current?.submit();
    if (data) {
      const { age_in_day, age_in_month, sex, ...biologicalTestValues } = data;
      const results = await biologicalAnalysis.makeInterpretation({
        age_in_day,
        age_in_month,
        sex,
        biologicalTestResults: Object.values(biologicalTestValues),
      });
      if ("data" in results) {
        setBiologicalInterpretationResults(results.data);
        setOnSucess(true);
        setShowResultModal(true);
      } else {
        console.error(JSON.parse(results.content));
        setError(JSON.parse(results.content));
      }
    }
    setOnSubmit(false);
  }, []);
  useEffect(() => {
    if (error) {
      toast.show("Error", "Erreur lors de l'interpretation", error);
    }
  }, [error]);
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
              <ButtonIcon as={Plus} className="h-5 w-5 text-white" />
            </Button>
          </HStack>
          <VStack className="rounded-xl bg-background-secondary p-3">
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              {...(selectedBioMarker.length > 2 && {
                contentContainerClassName: "pb-16",
              })}
            >
              <DynamicFormGenerator
                schema={formSchema}
                zodSchema={zodValidation}
                ref={dynamicFormRef}
                className="p-0 px-0"
                onChange={() => {
                  setError(null);
                  setOnSubmit(false);
                  setOnSucess(false);
                }}
              />
            </KeyboardAwareScrollView>
          </VStack>
        </VStack>
      </VStack>
      {selectedBioMarker.length != 0 && (
        <HStack className="w-full overflow-hidden rounded-xl">
          <FakeBlur className="w-full px-8 py-v-4">
            <Button
              className={`h-v-10 w-full rounded-xl ${error ? "bg-red-500" : "bg-primary-c_light"}`}
              onPress={handleSubmitForm}
            >
              {onSubmit ? (
                <ButtonSpinner
                  size={"small"}
                  className="data-[active=true]:text-primary-c_light"
                />
              ) : (
                <ButtonIcon as={Microscope} className="text-white" />
              )}
              <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
                Interpreter
              </ButtonText>

              {onSucess && <ButtonIcon as={Check} className="text-white" />}
              {error && <ButtonIcon as={X} className="text-white" />}
            </Button>
          </FakeBlur>
        </HStack>
      )}
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
      <BiologicalInterpretationResultModal
        isVisible={showResultModal}
        results={biologicalInterpretationResults}
        onClose={() => setShowResultModal(false)}
      />
    </React.Fragment>
  );
};
