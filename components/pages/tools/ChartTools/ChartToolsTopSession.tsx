import { VStack } from "@/components/ui/vstack";
import { FilterChips, SearchBar } from "../../shared";
import React, { useEffect, useState } from "react";
import { GROWTH_INDICATORS } from "@/src/constants/ui";
export interface ChartToolsTopSessionProps {
  onChange?: (value: { searchText: string; filterTag: string }) => void;
}
export const ChartToolsTopSession: React.FC<ChartToolsTopSessionProps> = ({
  onChange,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  useEffect(() => {
    onChange && onChange({ searchText, filterTag: selectedTag });
  }, [selectedTag, searchText]);
  return (
    <VStack
      className={"mb-4 gap-3 border-t-[1px] border-primary-border/5 pt-4"}
    >
      <VStack className="px-4">
        <SearchBar
          fieldProps={{
            placeholder: "Rechercher une courbe...",
            onChangeText: (text: string) => setSearchText(text),
            value: searchText,
          }}
        />
      </VStack>
      <FilterChips
        data={[
          { label: "Tous", value: "all" },
          ...Object.entries(GROWTH_INDICATORS).map(item => ({
            value: item[0],
            label: item[1].label,
          })),
        ]}
        value={selectedTag}
        onChange={value => setSelectedTag(value)}
      />
    </VStack>
  );
};
