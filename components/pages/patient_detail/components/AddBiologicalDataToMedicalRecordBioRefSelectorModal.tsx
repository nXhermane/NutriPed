import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { BiochemicalReferenceDto } from "@/core/diagnostics";
import { useCallback } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

export interface AddBiologicalDataToMedicalRecordBioRefSelectorModalProps {
  selectedBioMarker: string[];
  onSelect: (id: string) => void;
  data: BiochemicalReferenceDto[];
}
export const AddBiologicalDataToMedicalRecordBioRefSelectorModal: React.FC<
  AddBiologicalDataToMedicalRecordBioRefSelectorModalProps
> = ({ data, onSelect, selectedBioMarker }) => {
  const renderItem = useCallback(
    ({ item }: { item: BiochemicalReferenceDto }) => {
      return (
        <Pressable
          onPress={() => {
            onSelect(item.id as string);
          }}
        >
          <HStack
            className={`w-full rounded-xl bg-background-secondary p-3 ${selectedBioMarker.includes(item.id as string) ? "border-[1px] border-primary-c_light/50 bg-primary-c_light/10" : ""}`}
          >
            <Text>{item.name}</Text>
          </HStack>
        </Pressable>
      );
    },
    [selectedBioMarker]
  );

  return (
    <BottomSheetFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item?.name}
      showsVerticalScrollIndicator={false}
      contentContainerClassName={"gap-1 pb-v-5"}
    />
  );
};
