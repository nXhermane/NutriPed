import { Loading } from "@/components/custom";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import {
  useGenerateNutritionalDiagnostic,
  useNutritionalDiagnostic,
} from "@/src/hooks";
import React from "react";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";

export interface InitPatientDiagnosticProps {}

export function InitPatientDiagnosticRoot({
  children,
}: React.PropsWithChildren<InitPatientDiagnosticProps>): React.ReactNode {
  const { data, error, onLoading } = useNutritionalDiagnostic();
  const {
    error: generationError,
    generate,
    isSuccess,
    onLoading: onGenerating,
  } = useGenerateNutritionalDiagnostic();
  if (!data || onLoading) return <Loading />;
  if (data.modificationHistories.length === 0 && data.result === undefined)
    return (
      <React.Fragment>
        <Center className={"flex-1 bg-background-primary"}>
          <VStack className="w-11/12 gap-v-3">
            <Text className="text-center font-body text-sm font-normal text-typography-primary dark:text-typography-primary_light">
              Les données du patient sont déjà disponibles. Pour lancer
              l'analyse nutritionnelle, veuillez{" "}
              <Text className="font-h4 text-sm font-medium text-typography-primary dark:text-typography-primary_light">
                générer manuellement le diagnostic
              </Text>
              .
            </Text>

            <Button
              className="mx-4 h-v-10 rounded-xl bg-primary-c_light"
              onPress={() => generate()}
            >
              {onGenerating ? (
                <ButtonSpinner color={"#fff"} size={"small"} />
              ) : (
                <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
                  Generer le diagnostic
                </ButtonText>
              )}
            </Button>
            {/* <Text className="text-center font-body text-xs font-normal text-typography-primary dark:text-typography-primary_light">
              Cette opération est indispensable pour visualiser les résultats
              d'évaluation.
            </Text> */}
          </VStack>
        </Center>
      </React.Fragment>
    );

  return <>{children}</>;
}
