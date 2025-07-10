import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export function GlobalDiagnosticScreen() {
  return (
    <VStack className="flex-1 items-center justify-between bg-background-primary">
      <Text>
        Diagnostic globale a base de l'évaluation anthropometrique , clinique
      </Text>
    </VStack>
  );
}
