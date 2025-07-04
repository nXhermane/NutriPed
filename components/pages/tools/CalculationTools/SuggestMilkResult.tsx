import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { GetMilkRequest, MilkSuggestionResultDto } from "@/core/nutrition_care";
import { useToast } from "@/src/context";
import { useMilks } from "@/src/hooks";
import React, { useEffect, useMemo } from "react";
import colors from "tailwindcss/colors";
import { Divider } from "@/components/ui/divider";
import { BlurView } from "expo-blur";

export interface SuggestMilkResultProps {
  result: MilkSuggestionResultDto;
}

export const SuggestMilkResult: React.FC<SuggestMilkResultProps> = ({
  result,
}) => {
  const toast = useToast();
  const getMilkRequest = useMemo<GetMilkRequest>(() => {
    if (result) return { milkType: result.milkType };
    return {};
  }, [result]);
  const { data, onLoading, error } = useMilks(getMilkRequest);
  useEffect(() => {
    if (error) {
      toast.show(
        "Error",
        "Erreur de chargement",
        "Une erreur technique s'est produite, veillez reessayer plutard."
      );
      console.error(error);
    }
  }, [error]);
  if (onLoading)
    return (
      <Center className="flex-1 bg-background-primary">
        <Spinner size={"large"} color={colors.blue["600"]} />
      </Center>
    );
  return (
    <React.Fragment>
      <VStack className="m-4 mb-14 rounded-xl border-[1px] border-primary-border/5 bg-background-secondary px-2 py-3 overflow-hidden">
        <BlurView intensity={10} className="h-[50vh] w-2 absolute -left-1" />
        <HStack className="mb-3 w-full ">
          <Heading className="font-h4 text-lg font-medium text-primary-c_light">
            Résultat de la suggestion
          </Heading>
        </HStack>
        <HStack className="mb-3 justify-between">
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Type de lait:
          </Text>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {data[0]?.name}
          </Text>
        </HStack>
        <Divider className="mb-3 h-[1px] w-full" />
        <HStack className="mb-3 justify-between">
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Volume calculé:
          </Text>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {result.calculatedVolumeMl} ml/jour
          </Text>
        </HStack>
        <Divider className="mb-3 h-[1px] w-full" />
        <HStack className="mb-3 justify-between">
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Volume recommendé:
          </Text>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {result.recommendedVolumeMl} ml/jour
          </Text>
        </HStack>
        <Divider className="mb-3 h-[1px] w-full" />
        <HStack className="mb-3 justify-between">
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Fréquence d'alimentation:
          </Text>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {result.feedingFrequencies.join("-")} fois/jour
          </Text>
        </HStack>
        <Divider className="mb-3 h-[1px] w-full" />
      </VStack>
    </React.Fragment>
  );
};
