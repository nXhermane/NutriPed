import { useWizard, useWizardStep } from "@/components/custom/Wizard";
import { Loading } from "@/components/custom/Loading";
import { Text } from "@/components/ui/text";
import React, { useEffect, useMemo, useState } from "react";
import { usePediatricApp } from "@/adapter";
import {
  GetDiagnosticRuleRequest,
  GlobalDiagnosticDto,
  NutritionalAssessmentResultDto,
} from "@/core/evaluation";
import { useToast } from "@/src/context";
import { VStack } from "@/components/ui/vstack";
import { AnthropometricCalculatorResult } from "./AnthropometricCalculatorResult";
import { ClinicalEvaluationResult } from "./ClinicalEvaluationResult";
import { BiologicalInterpretationResults } from "./BiologicalInterpretationResults";
import { ScrollView } from "react-native";
import { useDiagnosticRules } from "@/src/hooks";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { Badge, BadgeText } from "@/components/ui/badge";
import { GLOBAL_DIAGNOSTIC_UI_INDICATOR } from "@/src/constants/ui";
import { Divider } from "@/components/ui/divider";

export interface GlobalDiagnosticResultProps {}

export const GlobalDiagnosticResult: React.FC<
  GlobalDiagnosticResultProps
> = ({}) => {
  const toast = useToast();
  const {
    diagnosticServices: { nutritionalDiagnostic },
  } = usePediatricApp();
  const { onPrev, onNext, data, error, setData, setError } = useWizardStep();
  const { wizardStates } = useWizard();
  const [diagnosticResult, setDiagnosticResult] =
    useState<NutritionalAssessmentResultDto | null>(null);

  useEffect(() => {
    onNext(async e => {
      setData(null);
      setError(null);
      setDiagnosticResult(null);
      e.preventDefault();
      const context = wizardStates[1].data.data.context;
      const anthropometricData = wizardStates[1].data.data.anthropometricData;
      const clinicalData = wizardStates[2].data.data;
      const biologicalData = wizardStates[3].data.data;
      if (context && anthropometricData && clinicalData && biologicalData) {
        const result = await nutritionalDiagnostic.makeIndependanteDiagnostic({
          context,
          anthropometric: anthropometricData,
          clinical: clinicalData,
          biological: biologicalData,
        });
        if ("data" in result) {
          setDiagnosticResult(result.data);
        } else {
          setError(JSON.parse(result.content));
          toast.show(
            "Error",
            "Erreur lors de l'analyse",
            JSON.parse(result.content)
          );
        }
      } else {
        console.error("Something wrong!");
        setError("Something wrongs!");
      }
    });
    onPrev(e => {});
  }, []);
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <VStack className="flex-1">
        {diagnosticResult ? (
          <VStack>
            <VStack className="pt-8">
              <VStack className="px-4 pb-v-4">
                <Heading className="font-h4 text-lg font-medium text-typography-primary">
                  Diagnostic Nutritionnel
                </Heading>
                <Text className="font-body text-xs font-normal text-typography-primary_light">
                  Analyse complète anthropométrique, clinique et biologique
                </Text>
              </VStack>
              <VStack className="gap-2 px-4">
                {diagnosticResult.globalDiagnostics.map(item => (
                  <GlobalDiagnosticResultCard key={item.code} results={item} />
                ))}
              </VStack>
            </VStack>
            <AnthropometricCalculatorResult
              results={diagnosticResult.growthIndicatorValues}
            />
            <ClinicalEvaluationResult
              results={diagnosticResult.clinicalAnalysis}
            />
            <BiologicalInterpretationResults
              results={diagnosticResult.biologicalInterpretation}
            />
          </VStack>
        ) : (
          <Center className="flex-grow pt-8">
            <Text className="text-center font-body text-sm text-typography-primary">
              Analyser afin d'avoir le Diagnostic Nutritionnel
            </Text>
          </Center>
        )}
      </VStack>
    </ScrollView>
  );
};

export interface GlobalDiagnosticResultCardProps {
  results: GlobalDiagnosticDto;
}

export const GlobalDiagnosticResultCard: React.FC<
  GlobalDiagnosticResultCardProps
> = ({ results }) => {
  const getDiagnosticRuleRequest = useMemo<GetDiagnosticRuleRequest>(
    () => ({
      code: results.code,
    }),
    [results.code]
  );
  const { data, error, onLoading } = useDiagnosticRules(
    getDiagnosticRuleRequest
  );

  if (onLoading) return <Loading />;

  return (
    <>
      <VStack className={`rounded-xl bg-background-secondary p-3`}>
        <HStack className="items-center justify-between">
          <VStack>
            <Heading className="font-h4 text-sm font-medium text-typography-primary">
              {data[0]?.name}
            </Heading>
          </VStack>
          <Badge
            className={`rounded-full py-0 ${GLOBAL_DIAGNOSTIC_UI_INDICATOR[results.code as keyof typeof GLOBAL_DIAGNOSTIC_UI_INDICATOR]?.color}`}
          >
            <BadgeText
              className={`text-right font-body text-xs font-normal ${GLOBAL_DIAGNOSTIC_UI_INDICATOR[results.code as keyof typeof GLOBAL_DIAGNOSTIC_UI_INDICATOR]?.textColor}`}
            >
              {
                GLOBAL_DIAGNOSTIC_UI_INDICATOR[
                  results.code as keyof typeof GLOBAL_DIAGNOSTIC_UI_INDICATOR
                ]?.label
              }
            </BadgeText>
          </Badge>
        </HStack>
        <Divider className="mb-2 mt-2 h-[1px] bg-primary-border/5" />
        <VStack>
          <Heading className="font-h4 text-xs font-medium text-typography-primary dark:text-typography-primary_light">
            Critères utilisés
          </Heading>
          <VStack className="mt-2 rounded-xl border-[0.5px] border-primary-border/5 p-2">
            {results.criteriaUsed.map(item => (
              <Text
                key={item}
                className="font-light_italic text-xs text-typography-primary dark:text-typography-primary_light"
              >
                {item}
              </Text>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </>
  );
};
