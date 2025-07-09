import React from "react";
import { ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { AnthropometricCalculatorResultDataType, RootState } from "@/src/store";
import { AnthropometricCalculatorHistoryItem } from "./AnthropometricCalculatorHistoryItem";

export const AnthropometricCalculatorHistory = () => {
  const savedResults = useSelector<
    RootState,
    AnthropometricCalculatorResultDataType[]
  >(
    (state: RootState) => state.anthropometricCalculatorResultReducer.histories // Adaptez selon votre store
  );

  if (!savedResults || savedResults.length === 0) {
    return (
      <VStack className="flex-1 items-center justify-center bg-background-primary p-8">
        <Text className="text-typography-secondary text-center">
          Aucun résultat sauvegardé pour le moment.
        </Text>
        <Text className="text-typography-secondary mt-2 text-center">
          Effectuez un calcul et sauvegardez-le pour le voir apparaître ici.
        </Text>
      </VStack>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="bg-background-primary"
    >
      <VStack className="space-y-4 p-4">
        {savedResults.map((item, index) => (
          <AnthropometricCalculatorHistoryItem
            key={index}
            item={item}
            onDelete={() => {
              // Implémentez la suppression
            }}
            onView={() => {
              // Implémentez la visualisation
            }}
          />
        ))}
      </VStack>
    </ScrollView>
  );
};
