import {
  BottomSheetDragIndicator,
  BottomSheetFlatList,
} from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { BiochemicalReferenceDto } from "@/core/diagnostics";
import { useUI } from "@/src/context";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import colors from "tailwindcss/colors";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";

export interface BiologicalInterpretationBiomakerSelectorModalProps {
  selectedBiomarkers: string[];
  biomarkers: BiochemicalReferenceDto[];
  onSelect: (id: string) => void;
  isVisible: boolean;
  onClose?: () => void;
}

export const BiologicalInterpretationBiomakerSelectorModal: React.FC<
  BiologicalInterpretationBiomakerSelectorModalProps
> = ({ biomarkers, isVisible, onSelect, selectedBiomarkers, onClose }) => {
  const { colorMode } = useUI();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const renderItem = useCallback(
    ({ item }: { item: BiochemicalReferenceDto }) => {
      return (
        <Pressable
          onPress={() => {
            onSelect(item.id as string);
          }}
        >
          <HStack
            className={`w-full rounded-xl bg-background-secondary p-3 ${selectedBiomarkers.includes(item.id as string) ? "border-[1px] border-primary-c_light/50 bg-primary-c_light/10" : ""}`}
          >
            <Text>{item.name}</Text>
          </HStack>
        </Pressable>
      );
    },
    [selectedBiomarkers]
  );
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheetModalProvider>
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
          data={biomarkers}
          renderItem={renderItem}
          keyExtractor={item => item?.name}
          showsVerticalScrollIndicator={false}
          contentContainerClassName={"gap-1 pb-v-5"}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
