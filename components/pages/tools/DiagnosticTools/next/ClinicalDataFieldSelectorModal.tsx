import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { DataFieldReferenceDto } from "@/core/evaluation";
import { AggregateID } from "@/core/shared";
import { useUI } from "@/src/context";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import colors from "tailwindcss/colors";

export interface ClinicalDataFieldSelectorModalProps {
    selectedFields: AggregateID[];
    fields: DataFieldReferenceDto[];
    onSelect: (id: AggregateID) => void;
    isVisible: boolean;
    onClose?: () => void;
}

export const ClinicalDataFieldSelectorModal: React.FC<ClinicalDataFieldSelectorModalProps> = ({
    fields, isVisible, onSelect, selectedFields, onClose
}) => {
    const { colorMode } = useUI();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const renderItem = useCallback(
        ({ item }: { item: DataFieldReferenceDto }) => {
            return (
                <Pressable
                    onPress={() => {
                        onSelect(item.id as string);
                    }}
                >
                    <HStack
                        className={`w-full rounded-xl bg-background-secondary p-3 ${selectedFields.includes(item.id) ? "border-[1px] border-primary-c_light/50 bg-primary-c_light/10" : ""}`}
                    >
                        <Text>{item.label}</Text>
                    </HStack>
                </Pressable>
            );
        },
        [selectedFields]
    );

    React.useEffect(() => {
        if (isVisible) {
            bottomSheetModalRef.current?.present();
        } else {
            bottomSheetModalRef.current?.close();
        }
    }, [isVisible]);
    return <React.Fragment>
        <BottomSheetModal
            onDismiss={() => onClose && onClose()}
            snapPoints={["60%"]}
            ref={bottomSheetModalRef}
            handleIndicatorStyle={{
                backgroundColor:
                    colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
            }}
            handleComponent={props => <BottomSheetDragIndicator {...props} />}
            backgroundComponent={props => {
                return (
                    <VStack {...props} className="rounded-2xl bg-background-primary" />
                );
            }}
            enablePanDownToClose={true}
            enableDynamicSizing={false}
        >

            <BottomSheetFlatList
                data={fields}
                renderItem={renderItem}
                keyExtractor={item => item.code}
                showsVerticalScrollIndicator={false}
                contentContainerClassName={"gap-1 pb-v-5"}
            />
        </BottomSheetModal>
    </React.Fragment>
}