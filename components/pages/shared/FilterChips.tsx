import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import React from "react";
import { ScrollView } from "react-native";

export interface FilterChipsProps {
  value?: string;
  onChange?: (value: string) => void;
  data: { value: string; label: string }[];
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  onChange,
  value,
  data,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={"gap-3 overflow-visible"}
      className="max-h-7"
    >
      {data.map(item => (
        <FilterChipItem
          key={item.value}
          title={item.label}
          state={item.value === value}
          onChange={state => state && onChange && onChange(item.value)}
        />
      ))}
    </ScrollView>
  );
};

export interface FilterChipItemProps {
  state?: boolean;
  onChange?: (state: boolean) => void;
  title: string;
}
export const FilterChipItem: React.FC<FilterChipItemProps> = ({
  state,
  onChange,
  title,
}) => {
  return (
    <Pressable
      className={`${state ? "bg-primary-c_light" : "bg-background-secondary"} rounded-full border-[0.5px] border-primary-border/10 px-4 py-v-1`}
      onPress={() => {
        const _value = !state;
        if (state) return;
        onChange && onChange(_value);
      }}
    >
      <Text
        className={`font-body text-sm font-normal ${false ? "text-background-primary" : "text-typography-primary"}`}
      >
        {title}
      </Text>
    </Pressable>
  );
};
