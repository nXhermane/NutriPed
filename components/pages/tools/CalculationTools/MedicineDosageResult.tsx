import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import {
  GetMedicineRequest,
  MedicineDosageResultDto,
  MedicineDto,
} from "@/core/nutrition_care";
import { useToast } from "@/src/context";
import { useMedicines } from "@/src/hooks";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo } from "react";
import colors from "tailwindcss/colors";
import { Divider } from "@/components/ui/divider";
import { Icon } from "@/components/ui/icon";
import { Lightbulb, TriangleAlert, Zap } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { Guard } from "@/core/shared";

export interface MedicineDosageResultProps {
  result: MedicineDosageResultDto;
  name: string;
  warnings: MedicineDto["warnings"];
  interactions: MedicineDto["interactions"];
  notes: MedicineDto['notes']
}

export const MedicineDosageResult: React.FC<MedicineDosageResultProps> = ({
  result,
  name,
  warnings,
  interactions,
  notes
}) => {
  console.log(result);
  return (
    <React.Fragment>
      <VStack className="m-4 overflow-hidden rounded-xl border-[1px] border-primary-border/5 bg-background-secondary px-2 py-3">
        <BlurView intensity={10} className="absolute -left-1 h-[50vh] w-2" />
        <HStack className="mb-3 w-full">
          <Heading className="font-h4 text-lg font-medium text-primary-c_light">
            Résultat du dosage
          </Heading>
        </HStack>
        <HStack className="mb-3 justify-between">
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Médicament:
          </Text>
          <Text
            className="w-[60%] font-h4 text-sm font-medium text-typography-primary text-right"
            numberOfLines={1}
          >
            {name}
          </Text>
        </HStack>
        <Divider className="mb-3 h-[1px] w-full" />
        <HStack className="mb-3 justify-between">
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Dosage quotidien:
          </Text>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {"value" in result.dailyDosage
              ? `${result.dailyDosage.value} ${result.dailyDosage.unit}`
              : `${result.dailyDosage.minValue}-${result.dailyDosage.maxValue} ${result.dailyDosage.unit}`}
          </Text>
        </HStack>
        <Divider className="mb-3 h-[1px] w-full" />
        <HStack className="mb-3 justify-between">
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Fréquence:
          </Text>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {result.dailyDosageFrequency}
            {" fois/jour"}
          </Text>
        </HStack>
        <Divider className="mb-3 h-[1px] w-full" />
        <HStack className="mb-3 justify-between">
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Voie d'administraction:
          </Text>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {result.administrationRoutes
              .map(item => item.toUpperCase())
              .join(",")}
          </Text>
        </HStack>
        <Divider className="mb-3 h-[1px] w-full" />
        <HStack className="mb-3 justify-between">
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Recommendation:
          </Text>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {result.label}
          </Text>
        </HStack>
      </VStack>
      {!Guard.isEmpty(warnings).succeeded && (
        <VStack className="mx-4 mb-4 overflow-hidden rounded-xl border-l-2 border-warning-500 bg-background-secondary px-4 py-4">
          <HStack className="mb-3 items-center gap-2">
            <Icon as={TriangleAlert} className="h-5 w-5 text-yellow-500" />
            <Heading className="font-h4 text-lg font-medium text-warning-500">
              Avertissements
            </Heading>
          </HStack>
          <VStack className="gap-2">
            {warnings.map((item, index) => (
              <Text
                key={index}
                className="font-body text-sm text-typography-primary"
              >
                <Box className="h-1 w-1 rounded-full bg-primary-c_light" />{" "}
                {item}
              </Text>
            ))}
          </VStack>
        </VStack>
      )}
      {!Guard.isEmpty(interactions).succeeded && (
        <VStack className="mx-4 mb-4 overflow-hidden rounded-xl border-l-2 border-error-500 bg-background-secondary px-4 py-4">
          <HStack className="mb-3 items-center gap-2">
            <Icon as={Zap} className="h-5 w-5 text-yellow-500" />
            <Heading className="font-h4 text-lg font-medium text-error-500">
              Interactions
            </Heading>
          </HStack>
          <VStack className="gap-2">
            {interactions.map((item, index) => (
              <Text
                key={index}
                className="font-body text-sm text-typography-primary"
              >
                <Box className="h-1 w-1 rounded-full bg-primary-c_light" />{" "}
                {item}
              </Text>
            ))}
          </VStack>
        </VStack>
      )}
      {!Guard.isEmpty(notes).succeeded && (
        <VStack className="mx-4 mb-4 overflow-hidden rounded-xl border-l-2 border-info-500 bg-background-secondary px-4 py-4">
          <HStack className="mb-3 items-center gap-2">
            <Icon as={Lightbulb} className="h-5 w-5 text-yellow-500" />
            <Heading className="font-h4 text-lg font-medium text-info-500">
              Notes importantes
            </Heading>
          </HStack>
          <VStack className="gap-2">
            {notes.map((item, index) => (
              <Text
                key={index}
                className="font-body text-sm text-typography-primary"
              >
                <Box className="h-1 w-1 rounded-full bg-primary-c_light" />{" "}
                {item}
              </Text>
            ))}
          </VStack>
        </VStack>
      )}
    </React.Fragment>
  );
};
