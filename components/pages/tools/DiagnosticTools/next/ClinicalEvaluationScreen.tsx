import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React from "react";
import { useDataFields } from "@/src/hooks";
import { Loading } from "@/components/custom";
import { ClinicalEvaluationPanel } from "./ClinicalEvaluationPanel";

export interface ClinicalEvaluationScreenProps {

}
export const ClinicalEvaluationScreen: React.FC<ClinicalEvaluationScreenProps> = (props) => {
  
    return <VStack className="bg-background-primary flex-1 items-center justify-between">
        <ClinicalEvaluationPanel />
    </VStack>
}