import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
} from "@/components/ui/button";
import { useGenerateNutritionalDiagnostic } from "@/src/hooks";
import React from "react";
import { RotateCcw } from "lucide-react-native";


export const EmptyDiagnostic = () => {
  const {
    error: generationError,
    generate,
    isSuccess,
    onLoading: onGenerating,
  } = useGenerateNutritionalDiagnostic();
  return (
    <Center className="gap-3">
      <Text className="font-light_italic text-xs text-typography-primary_light text-center">
        Le diagnostic n'est pas encore générer. Cliquer sur le bouton pour
        ci-dessous pour generer
      </Text>
      <Button
        className=" rounded-full bg-primary-c_light p-3 "
        onPress={() => generate()}
      >
        {onGenerating ? (
          <ButtonSpinner color={"#fff"} size={"small"} />
        ) : (
          <ButtonIcon as={RotateCcw} color={"#fff"} className="h-6 w-6" />
        )}
      </Button>
    </Center>
  );
};
