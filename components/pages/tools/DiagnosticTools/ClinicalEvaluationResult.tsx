import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { ClinicalNutritionalAnalysisResultDto } from "@/core/diagnostics";
import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeInCardY } from "@/components/custom/motion/FadeInCardY";
import { HStack } from "@/components/ui/hstack";
import {
  ArrowBigDownDash,
  ArrowBigUpDash,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { useClinicalReference } from "@/src/hooks";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Loading } from "@/components/custom";

export interface ClinicalEvaluationResultProps {
  title?: string;
  results: ClinicalNutritionalAnalysisResultDto[];
}

export const ClinicalEvaluationResult: React.FC<
  ClinicalEvaluationResultProps
> = ({ results }) => {
  return (
    <React.Fragment>
      <VStack className="pb-v-4">
        <VStack className="px-4 pb-v-4">
          <Heading className="font-h4 text-lg font-medium text-typography-primary">
            Résultat de l'examen clinique
          </Heading>
          <Text className="font-body text-xs font-normal text-typography-primary_light">
            Analyse complète des signes cliniques
          </Text>
        </VStack>
        <Accordion className="gap-3 bg-transparent">
          {results.map((result, index) => {
            return (
              <FadeInCardY key={result.clinicalSign} delayNumber={2 * index}>
                <ClinicalEvalutationResultItem result={result} />
              </FadeInCardY>
            );
          })}
        </Accordion>
      </VStack>
    </React.Fragment>
  );
};
export interface ClinicalEvalutationResultItemProps {
  result: ClinicalNutritionalAnalysisResultDto;
}

export const ClinicalEvalutationResultItem: React.FC<
  ClinicalEvalutationResultItemProps
> = ({ result }) => {
  const getClinicalRefRequest = useMemo(
    () => ({
      code: result.clinicalSign,
    }),
    [result.clinicalSign]
  );
  const { data, error, onLoading } = useClinicalReference(
    getClinicalRefRequest
  );

  if (onLoading) {
    return <Loading />;
  }

  return (
    <AccordionItem
      value={result.clinicalSign}
      className={`mx-4 overflow-hidden rounded-xl border-[1px] border-primary-border/5 bg-background-secondary`}
    >
      <AccordionHeader className="">
        <AccordionTrigger>
          {({ isExpanded }: any) => {
            return (
              <>
                <VStack className="w-full gap-1">
                  <HStack>
                    <AccordionTitleText
                      className={`font-h4 text-sm font-medium text-typography-primary`}
                    >
                      {data[0]?.name}
                    </AccordionTitleText>
                    {result.suspectedNutrients.length != 0 &&
                      (isExpanded ? (
                        <AccordionIcon as={ChevronUp} />
                      ) : (
                        <AccordionIcon as={ChevronDown} />
                      ))}
                  </HStack>

                  {result.suspectedNutrients.length != 0 && (
                    <HStack>
                      <Text className="font-body text-xs font-normal text-typography-primary_light">
                        {result.suspectedNutrients.length} déficience(s) •{" "}
                        {result.recommendedTests.length} test(s)
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </>
            );
          }}
        </AccordionTrigger>
      </AccordionHeader>
      {(result.suspectedNutrients.length != 0 ||
        result.recommendedTests.length != 0) && (
        <AccordionContent className="bg-background-primary">
          <VStack>
            <VStack className="w-full px-1">
              <HStack className="w-full py-2">
                <Text className="font-body text-sm font-normal uppercase text-warning-500">
                  Nutriments Suspectés
                </Text>
              </HStack>
              <VStack className="gap-1">
                {result.suspectedNutrients.map(nutrient => (
                  <HStack
                    key={nutrient.nutrient}
                    className="justify-between gap-1 rounded-lg bg-background-secondary px-2 py-2"
                  >
                    <Text className="font-body text-sm font-normal text-typography-primary">
                      {nutrient.nutrient}
                    </Text>

                    <Badge
                      className={`rounded-full py-0 ${nutrient.effect === "excess" ? "bg-rose-50" : "bg-red-50"}`}
                    >
                      {nutrient.effect === "excess" ? (
                        <BadgeIcon
                          as={ArrowBigUpDash}
                          className="h-3 w-3 text-rose-500"
                        />
                      ) : (
                        <BadgeIcon
                          as={ArrowBigDownDash}
                          className="h-3 w-3 text-red-500"
                        />
                      )}
                      <BadgeText
                        className={`font-light text-2xs ${nutrient.effect === "excess" ? "text-rose-500" : "text-red-500"}`}
                      >
                        {nutrient.effect}
                      </BadgeText>
                    </Badge>
                  </HStack>
                ))}
              </VStack>
            </VStack>
            <VStack className="w-full px-1">
              <HStack className="w-full py-2">
                <Text className="font-body text-sm font-normal uppercase text-warning-500">
                  Tests Recommandés
                </Text>
              </HStack>
              <VStack className="gap-1">
                {result.recommendedTests.map(test => (
                  <VStack
                    key={test.testName}
                    className="gap-1 rounded-lg bg-background-secondary px-2 py-2"
                  >
                    <Text className="font-body text-sm font-normal text-typography-primary">
                      {test.testName}
                    </Text>
                    <Text className="font-body text-2xs font-normal text-typography-primary_light">
                      {test.reason}
                    </Text>
                  </VStack>
                ))}
              </VStack>
            </VStack>
          </VStack>
        </AccordionContent>
      )}
    </AccordionItem>
  );
};
