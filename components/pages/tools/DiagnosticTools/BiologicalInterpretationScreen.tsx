import { Loading } from "@/components/custom";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useBiochemicalReference } from "@/src/hooks";
import { BiologicalInterpretationPanel } from "./BiologicalInterpretationPanel";

export function BiologicalInterpretationScreen() {
  const { data, error, onLoading } = useBiochemicalReference();

  if (onLoading) return <Loading> Chargement... </Loading>;

  return (
    <VStack className="flex-1 items-center justify-between bg-background-primary px-4">
     <BiologicalInterpretationPanel biochemicalDtos={data} />
    </VStack>
  );
}
