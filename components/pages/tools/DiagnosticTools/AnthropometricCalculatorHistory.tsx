import React, { useCallback, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  AnthropometricCalculatorResultDataType,
  deleteAnthropometricCalculatorResult,
  RootState,
} from "@/src/store";
import { AnthropometricCalculatorHistoryItem } from "./AnthropometricCalculatorHistoryItem";
import { GrowthIndicatorValueDto } from "@/core/diagnostics";
import { AnthropometricCalculatorResultModal } from "./AnthropometricCalculatorResultModal";
import { FadeInCardX } from "@/components/custom/motion";
import { HStack } from "@/components/ui/hstack";
import { BlurView } from "expo-blur";
import { useUI } from "@/src/context";
import { Button, ButtonText } from "@/components/ui/button";
import { useExportAnthropometicResultToXlsx } from "@/src/hooks";

export const AnthropometricCalculatorHistory = () => {
  const { colorMode } = useUI();
  const savedResults = useSelector<
    RootState,
    AnthropometricCalculatorResultDataType[]
  >(
    (state: RootState) => state.anthropometricCalculatorResultReducer.histories // Adaptez selon votre store
  );
  const dispatch = useDispatch();
  const exportHistoryToXlsx = useExportAnthropometicResultToXlsx();

  const deleteResult = useCallback((id: string) => {
    dispatch(deleteAnthropometricCalculatorResult({ id }));
  }, []);
  const deleteAllHandler = useCallback(
    (results: AnthropometricCalculatorResultDataType[]) => {
      Alert.alert(
        "Suppression de l’historique",
        "Cette action effacera définitivement tous les résultats enregistrés. Voulez-vous continuer ?",
        [
          {
            text: "Oui",
            onPress() {
              results.forEach(result => deleteResult(result.id));
            },
            isPreferred: true,
            style: "default",
          },
          {
            text: "Non",
            style: "destructive",
            onPress: () => {
              return void 0;
            },
          },
        ]
      );
    },
    []
  );
  const [anthropometricCalculatorResult, setAnthropometricCalculatorResult] =
    useState<GrowthIndicatorValueDto[] | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  if (!savedResults || savedResults.length === 0) {
    return (
      <VStack className="flex-1 items-center justify-center bg-background-primary p-8">
        <Text className="text-center font-body text-xs text-typography-primary_light">
          Aucun résultat sauvegardé pour le moment.
        </Text>
        <Text className="mt-2 text-center font-body text-xs text-typography-primary_light">
          Effectuez un calcul et sauvegardez-le pour le voir apparaître ici.
        </Text>
      </VStack>
    );
  }

  return (
    <React.Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-background-primary"
        contentContainerClassName="flex-1"
      >
        <VStack className="h-full gap-4 p-4">
          {savedResults.map((item, index) => (
            <FadeInCardX key={index} delayNumber={index * 3}>
              <AnthropometricCalculatorHistoryItem
                item={item}
                onDelete={() => {
                  deleteResult(item.id);
                  setShowResultModal(false);
                  setAnthropometricCalculatorResult(null);
                  setCurrentTitle(null);
                }}
                onView={() => {
                  setAnthropometricCalculatorResult(item.result);
                  setCurrentTitle(`Resultat stocker de ${item.name}`);
                  setShowResultModal(true);
                }}
              />
            </FadeInCardX>
          ))}
        </VStack>
      </ScrollView>

      <HStack className="absolute bottom-0 w-full overflow-hidden rounded-xl">
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={50}
          tint={colorMode}
          className="w-full flex-row gap-3 px-4 py-4"
        >
          <Button
            className={`rounded-xl border-red-500`}
            variant="outline"
            onPress={() => {
              deleteAllHandler(savedResults);
            }}
          >
            <ButtonText className={`font-h4 text-sm font-medium text-red-500`}>
              Supprimer tout
            </ButtonText>
          </Button>
          <Button
            className={`w-1/2 rounded-xl bg-primary-c_light`}
            onPress={() => {
              exportHistoryToXlsx(savedResults);
            }}
          >
            <ButtonText
              className={`font-h4 text-sm font-medium text-typography-primary`}
            >
              Exporter tout
            </ButtonText>
          </Button>
        </BlurView>
      </HStack>
      <AnthropometricCalculatorResultModal
        title={currentTitle as string}
        isVisible={showResultModal}
        results={anthropometricCalculatorResult}
        onClose={() => {
          setShowResultModal(false);
          setAnthropometricCalculatorResult(null);
        }}
      />
    </React.Fragment>
  );
};
