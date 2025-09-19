import React, { useMemo } from "react";
import { PatientDetailMedicalRecordSession } from "../PatientDetailMedicalRecord";
import {
  GetDiagnosticRuleRequest,
  GlobalDiagnosticDto,
  NutritionalDiagnosticDto,
} from "@/core/evaluation";
import { EmptyDiagnostic } from "./EmptyDiagnostic";
import { CardPressEffect, FadeInCardX } from "@/components/custom/motion";
import { Text } from "@/components/ui/text";
import { useDiagnosticRules } from "@/src/hooks";
import { Loading } from "@/components/custom";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Badge, BadgeText } from "@/components/ui/badge";
import { GLOBAL_DIAGNOSTIC_UI_INDICATOR } from "@/src/constants/ui";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Center } from "@/components/ui/center";

export interface GlobalDiagnosticSessionProps {
  nutritionalDiagnosticDto: NutritionalDiagnosticDto;
}

export const GlobalDiagnosticSession: React.FC<
  GlobalDiagnosticSessionProps
> = ({ nutritionalDiagnosticDto: { result } }) => {
  return (
    <PatientDetailMedicalRecordSession
      title="Diagnostics globaux"
      rightNode={() => {
        return (
          <HStack>
            <Text className="font-body text-2xs font-normal text-typography-primary_light">
              {result?.globalDiagnostics.length} diagnostic{"s"}
            </Text>
          </HStack>
        );
      }}
    >
      <VStack className="mx-4">
        {result == undefined ? (
          <EmptyDiagnostic />
        ) : (
          <React.Fragment>
            {result.globalDiagnostics.length == 0 ? (
              result.growthIndicatorValues.length == 0 ? (
                <Center>
                  <Text className="text-center font-body text-sm font-normal text-typography-primary">
                    Veillez verifier si vous avez entrée les données
                    anthropometriques.
                  </Text>
                </Center>
              ) : (
                <Center className="rounded-xl bg-background-secondary px-4 py-v-3">
                  <Text className="font-h4 text-sm font-medium text-green-500">
                    Bon état nutritionnel
                  </Text>
                </Center>
              )
            ) : (
              <Accordion className="gap-3 bg-transparent">
                {result.globalDiagnostics.map((item, index) => (
                  <FadeInCardX delayNumber={index} key={item.code}>
                    <GlobalDiagnosticCard diagnostic={item} />
                  </FadeInCardX>
                ))}
              </Accordion>
            )}
          </React.Fragment>
        )}
      </VStack>
    </PatientDetailMedicalRecordSession>
  );
};

export interface GlobalDiagnosticCardProps {
  diagnostic: GlobalDiagnosticDto;
}

export const GlobalDiagnosticCard: React.FC<GlobalDiagnosticCardProps> = ({
  diagnostic,
}) => {
  const getDiagnosticRuleRequest = useMemo<GetDiagnosticRuleRequest>(
    () => ({
      code: diagnostic.code,
    }),
    [diagnostic.code]
  );
  const { data, error, onLoading } = useDiagnosticRules(
    getDiagnosticRuleRequest
  );

  if (data.length === 0 || onLoading) return <Loading />;
  const global_diagnostic_ui =
    GLOBAL_DIAGNOSTIC_UI_INDICATOR[
      diagnostic.code as keyof typeof GLOBAL_DIAGNOSTIC_UI_INDICATOR
    ];
  return (
    <React.Fragment>
      <CardPressEffect>
        <VStack className="rounded-xl bg-background-secondary px-3 py-v-3">
          <AccordionItem value={diagnostic.code} className="w-full">
            <AccordionHeader className="">
              <AccordionTrigger className="p-0">
                {({ isExpanded }: { isExpanded: boolean }) => {
                  return (
                    <HStack className="w-full items-center justify-between">
                      <Heading className="font-h4 text-base font-medium text-typography-primary">
                        {data[0]?.name}
                      </Heading>
                      <Badge
                        className={`rounded-full py-0 ${global_diagnostic_ui?.color}`}
                      >
                        <BadgeText
                          className={`text-right font-body text-xs font-normal ${global_diagnostic_ui?.textColor}`}
                        >
                          {global_diagnostic_ui.label}
                        </BadgeText>
                      </Badge>
                    </HStack>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="p-0">
              <Divider className="mb-2 mt-2 h-[1px] bg-primary-border/5" />
              <VStack>
                <Heading className="font-h4 text-xs font-medium text-typography-primary dark:text-typography-primary_light">
                  Critères utilisés
                </Heading>
                <VStack className="mt-2 rounded-xl border-[0.5px] border-primary-border/5 p-2">
                  {diagnostic.criteriaUsed.map(item => (
                    <Text
                      key={item}
                      className="font-light_italic text-xs text-typography-primary dark:text-typography-primary_light"
                    >
                      {item}
                    </Text>
                  ))}
                </VStack>
              </VStack>
            </AccordionContent>
          </AccordionItem>
        </VStack>
      </CardPressEffect>
    </React.Fragment>
  );
};
