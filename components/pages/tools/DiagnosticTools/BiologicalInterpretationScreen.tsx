import { Loading } from "@/components/custom";
import { VStack } from "@/components/ui/vstack";
import { useBiochemicalReference } from "@/src/hooks";
import { BiologicalInterpretationPanel } from "./BiologicalInterpretationPanel";
import React from "react";

export function BiologicalInterpretationScreen() {
  const { data, error, onLoading } = useBiochemicalReference();

  if (onLoading) return <Loading> Chargement... </Loading>;

  return (
    <React.Fragment>
      <VStack className="flex-1 items-center justify-between bg-background-primary">
        <BiologicalInterpretationPanel biochemicalDtos={data} />
      </VStack>
    </React.Fragment>
  );
}
