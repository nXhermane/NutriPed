import {
  Button,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";

export interface InitPatientTriggerProps {
  onTrigger?: () => Promise<void>;
}

export const InitPatientTrigger: React.FC<InitPatientTriggerProps> = ({
  onTrigger,
}) => {
  const [onWaching, setOnWaching] = useState<boolean>(false);
  return (
    <VStack className="w-11/12 gap-v-3">
      <Text className="text-center font-body text-sm font-normal text-typography-primary dark:text-typography-primary_light">
        Avant de commencer l'évaluation nutritionnelle, veuillez saisir les
        données anthropométriques de base du patient (poids, taille, périmètre
        crânien, etc.).
      </Text>
      <Button
        className="bg-primary-c_light"
        onPress={async () => {
          setOnWaching(true);
          onTrigger && (await onTrigger());
          setOnWaching(false);
        }}
      >
        {onWaching ? (
          <ButtonSpinner color={"#fff"} size={"small"} />
        ) : (
          <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
            Saisir les données du patient
          </ButtonText>
        )}
      </Button>
    </VStack>
  );
};
