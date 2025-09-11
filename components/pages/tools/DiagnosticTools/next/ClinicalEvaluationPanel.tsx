import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { ClinicalDataFieldSelectorModal } from "./ClinicalDataFieldSelectorModal";
import { Loading } from "@/components/custom";
import { useDataFields } from "@/src/hooks";
import { AggregateID } from "@/core/shared";

export interface ClinicalEvaluationPanelProps {

}

export const ClinicalEvaluationPanel: React.FC<ClinicalEvaluationPanelProps> = () => {
    const { data, onLoading, error, reload } = useDataFields()
    const [selectedFiels, setSelectedFields] = useState<AggregateID[]>([]);
    const [showSelectionModal, setShowSelectionModal] = useState<boolean>(false);
    if (onLoading || error) return <Loading
        state={onLoading ? "loading" : error ? "error" : 'empty'}
        onReload={reload}
    />

    return <React.Fragment>
        <VStack className="w-full flex-1 px-4">
            <VStack className="w-full flex-1 pt-5">
                <HStack className="mb-3 w-full items-center justify-between rounded-xl bg-background-secondary p-3">
                    <VStack className="w-[80%]">
                        <Heading className="font-h4 text-lg font-medium text-typography-primary">
                            Ajoutez un champs
                        </Heading>
                        <Text className="font-body text-xs font-normal text-typography-primary_light">
                            Sélectionnez les champs d'évaluation clinique que vous souhaitez remplir pour ce patient.
                        </Text>
                    </VStack>
                    <Button
                        className="h-fit rounded-full bg-primary-c_light p-0 px-2 py-2"
                        onPress={() => setShowSelectionModal(true)}
                    >
                        <ButtonIcon as={Plus} className="h-5 w-5 text-white" />
                    </Button>
                </HStack>
            </VStack>
        </VStack>
        <ClinicalDataFieldSelectorModal fields={data} isVisible={showSelectionModal} onSelect={(id) => setSelectedFields(prev => [...prev, id])} selectedFields={selectedFiels} onClose={() => setShowSelectionModal(false)} />
    </React.Fragment>
}