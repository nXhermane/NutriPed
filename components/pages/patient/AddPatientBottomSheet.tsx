import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React from "react";
export interface AddPatientBottomSheetProps {
    isOpen?: boolean
    onClose?: () => void
}
export const AddPatientBottomSheet: React.FC<AddPatientBottomSheetProps> = ({ isOpen, onClose = () => void 0 }) => {
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent className={"bg-background-secondary"}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator className={"h-v-1 w-5 rounded-sm"} />
                </ActionsheetDragIndicatorWrapper>
                <VStack className={"h-[85vh]"}>
                    <HStack className={"w-full items-center justify-between"}>
                        <Heading className={"font-h2 text-2xl text-typography-primary"}>
                            Nouveau Patient
                        </Heading>
                        <Pressable className={"px-4 py-[4px] rounded-lg bg-primary-c_light"}>
                            <Text className={"font-body text-xs"}>
                                Ajouter
                            </Text>
                        </Pressable>
                    </HStack>
                    <VStack className={"py-v-4 gap-y-4"}>

                    </VStack>
                </VStack>
            </ActionsheetContent>
        </Actionsheet>
    );
};
