import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useClinicalReference } from "@/src/hooks";
import colors from "tailwindcss/colors";

export function ClinicalEvaluationScreen() {
  const { data, onLoading, error } = useClinicalReference();
  if (onLoading)
    return (
      <Center className="flex-1 bg-background-primary">
        <Spinner size={"large"} className="mt-8" color={colors.blue["600"]} />
        <Text className="mt-4 font-body text-sm font-normal text-typography-primary_light">
          {"Chargement..."}
        </Text>
      </Center>
    );

  console.log(data[0]);
  return (
    <VStack className="flex-1 items-center justify-between bg-background-primary">
      <Text>Evaluation clinique</Text>
    </VStack>
  );
}
