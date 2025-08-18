import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { ClinicalSignReferenceDto } from "@/core/evaluation";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import React from "react";

export interface AddClinicalDataToMedicalRecordClinicalSignSelectorModalProps {
  selectedClinicalSigns: ClinicalSignReferenceDto[];
  data: ClinicalSignReferenceDto[];
  onSelect: (sign: ClinicalSignReferenceDto) => void;
}

export const AddClinicalDataToMedicalRecordClinicalSignSelectorModal: React.FC<
  AddClinicalDataToMedicalRecordClinicalSignSelectorModalProps
> = ({ data, onSelect, selectedClinicalSigns }) => {
  const renderItem = useCallback(
    ({ item }: { item: ClinicalSignReferenceDto }) => {
      return (
        <Pressable
          onPress={() => {
            onSelect(item);
          }}
        >
          <HStack
            className={`w-full rounded-xl bg-background-secondary p-3 ${selectedClinicalSigns.includes(item) ? "border-[1px] border-primary-c_light/50 bg-primary-c_light/10" : ""}`}
          >
            <Text>{item.name}</Text>
          </HStack>
        </Pressable>
      );
    },
    [selectedClinicalSigns]
  );

  return (
    <BottomSheetFlatList
      className=""
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.name}
      showsVerticalScrollIndicator={false}
      contentContainerClassName={"gap-1 pb-v-5 "}
    />
  );
};
