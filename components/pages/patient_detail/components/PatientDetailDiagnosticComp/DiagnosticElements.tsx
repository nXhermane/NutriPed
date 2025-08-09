import { PatientDetailMedicalRecordSession } from "../PatientDetailMedicalRecord";
import { NutritionalDiagnosticDto } from "@/core/diagnostics";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FlaskConical,
  Ruler,
  Stethoscope,
} from "lucide-react-native";
import { FadeInCardX, FadeInCardY } from "@/components/custom/motion";
import { IndicatorCard } from "@/components/pages/tools/DiagnosticTools/IndicatorCard";
import { ClinicalEvalutationResultItem } from "@/components/pages/tools/DiagnosticTools/ClinicalEvaluationResult";
import { BiologicalInterpretationItem } from "@/components/pages/tools/DiagnosticTools/BiologicalInterpretationResults";
import React from "react";

export interface DiagnosticElmentsProps {
  nutDiagnosticDto: NutritionalDiagnosticDto;
}

export const DiagnosticElements: React.FC<DiagnosticElmentsProps> = ({
  nutDiagnosticDto,
}) => {
  const nutritionalDiagnosticResult = nutDiagnosticDto.result;
  return (
    <PatientDetailMedicalRecordSession title="Elements de diagnostic">
      <Accordion>
        {nutritionalDiagnosticResult === undefined ? (
          <></>
        ) : (
          <>
            <AccordionItem value="growth_indicator">
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <HStack className="w-full items-center justify-between">
                          <HStack className="items-center gap-2">
                            <Center className="rounded-full bg-blue-500/20 p-1">
                              <Icon
                                as={Ruler}
                                className="h-4 w-4 text-blue-500"
                              />
                            </Center>
                            <Text className="font-h4 text-base font-medium text-typography-primary">
                              Indicateurs de croissance
                            </Text>
                          </HStack>
                          <HStack className="gap-2">
                            <Center className="rounded-full bg-blue-500/20 px-1">
                              <Text className="rounded-full font-body text-xs font-normal text-blue-500">
                                {
                                  nutritionalDiagnosticResult
                                    .growthIndicatorValues.length
                                }
                              </Text>
                            </Center>
                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="h-4 w-4"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="h-4 w-4"
                              />
                            )}
                          </HStack>
                        </HStack>
                      </>
                    );
                  }}
                </AccordionTrigger>
                <AccordionContent className="gap-v-3">
                  {nutritionalDiagnosticResult.growthIndicatorValues.map(
                    indicator => (
                      <FadeInCardX key={indicator.code}>
                        <IndicatorCard value={indicator} />
                      </FadeInCardX>
                    )
                  )}
                </AccordionContent>
              </AccordionHeader>
            </AccordionItem>
            <AccordionItem value="clinical_signs">
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <HStack className="w-full items-center justify-between">
                          <HStack className="items-center gap-2">
                            <Center className="rounded-full bg-purple-500/20 p-1">
                              <Icon
                                as={Stethoscope}
                                className="h-4 w-4 text-purple-500"
                              />
                            </Center>
                            <Text className="font-h4 text-base font-medium text-typography-primary">
                              Signes cliniques
                            </Text>
                          </HStack>
                          <HStack className="gap-2">
                            <Center className="rounded-full bg-blue-500/20 px-1">
                              <Text className="rounded-full font-body text-xs font-normal text-blue-500">
                                {
                                  nutritionalDiagnosticResult.clinicalAnalysis
                                    .length
                                }
                              </Text>
                            </Center>
                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="h-4 w-4"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="h-4 w-4"
                              />
                            )}
                          </HStack>
                        </HStack>
                      </>
                    );
                  }}
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion className="gap-3 bg-transparent">
                    {nutritionalDiagnosticResult.clinicalAnalysis.map(
                      (sign, index) => (
                        <FadeInCardY
                          key={sign.clinicalSign}
                          delayNumber={2 * index}
                        >
                          <ClinicalEvalutationResultItem result={sign} />
                        </FadeInCardY>
                      )
                    )}
                  </Accordion>
                </AccordionContent>
              </AccordionHeader>
            </AccordionItem>
            <AccordionItem value="biological_sign">
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <HStack className="w-full items-center justify-between">
                          <HStack className="items-center gap-2">
                            <Center className="rounded-full bg-indigo-500/20 p-1">
                              <Icon
                                as={FlaskConical}
                                className="h-4 w-4 text-indigo-500"
                              />
                            </Center>
                            <Text className="font-h4 text-base font-medium text-typography-primary">
                              Resultats biologiques
                            </Text>
                          </HStack>
                          <HStack className="gap-2">
                            <Center className="rounded-full bg-blue-500/20 px-1">
                              <Text className="rounded-full font-body text-xs font-normal text-blue-500">
                                {
                                  nutritionalDiagnosticResult
                                    .biologicalInterpretation.length
                                }
                              </Text>
                            </Center>
                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="h-4 w-4"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="h-4 w-4"
                              />
                            )}
                          </HStack>
                        </HStack>
                      </>
                    );
                  }}
                </AccordionTrigger>
                <AccordionContent className="gap-v-3">
                  {nutritionalDiagnosticResult.biologicalInterpretation.map(
                    (testResult, index) => (
                      <FadeInCardY
                        key={testResult.code}
                        delayNumber={2 * index}
                      >
                        <BiologicalInterpretationItem data={testResult} />
                      </FadeInCardY>
                    )
                  )}
                </AccordionContent>
              </AccordionHeader>
            </AccordionItem>
          </>
        )}
      </Accordion>
    </PatientDetailMedicalRecordSession>
  );
};
