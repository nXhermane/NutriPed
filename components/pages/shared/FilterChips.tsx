import { FadeInCardX } from "@/components/custom/motion";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import React from "react";
import { ScrollView } from "react-native";

export interface FilterChipsProps<T> {
  value?: T;
  onChange?: (value: T) => void;
  data: { value: T; label: string }[];
}

export const FilterChips = <T,>({
  onChange,
  value,
  data,
}: FilterChipsProps<T>) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={"gap-3 overflow-visible"}
      className="max-h-7"
      nestedScrollEnabled
      keyboardShouldPersistTaps={"handled"}
    >
      {data.map((item, index) => (
        <FadeInCardX key={item.label} delayNumber={index + 3}>
          <FilterChipItem
            key={item.label}
            title={item.label}
            state={JSON.stringify(item.value) === JSON.stringify(value)}
            onChange={state => state && onChange && onChange(item.value)}
          />
        </FadeInCardX>
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
