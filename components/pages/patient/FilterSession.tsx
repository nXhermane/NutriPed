import { ScrollView } from "moti";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import {
  PATIENT_QUICK_FILTER_ITEMS,
  PATIENT_QUICK_FILTER_TAG,
} from "@/src/constants/ui";

export interface QuickFilterSessionProps {
  onChange?: (tag: PATIENT_QUICK_FILTER_TAG) => void;
}
export const QuickFilterSession: React.FC<QuickFilterSessionProps> = ({
  onChange,
}) => {
  const [selectedTag, setSelectedTag] = useState<PATIENT_QUICK_FILTER_TAG>(
    PATIENT_QUICK_FILTER_TAG.ALL
  );
  useEffect(() => {
    onChange && onChange(selectedTag);
  }, [selectedTag]);
  
  return (
    <Box>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={"gap-3 overflow-visible"}
      >
        {PATIENT_QUICK_FILTER_ITEMS.map((item, index) => (
          <QuickFilterItem
            title={item.title}
            value={item.tag === selectedTag}
            key={index}
            onChange={value => {
              if (value) {

                setSelectedTag(item.tag)}
            }}
          />
        ))}
      </ScrollView>
    </Box>
  );
};
export interface QuicFilterItemProps {
  title: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}
export const QuickFilterItem: React.FC<QuicFilterItemProps> = ({
  value = false,
  title,
  onChange,
}) => {
  const [state, setState] = useState<boolean>();
  useEffect(() => {
    setState(value);
  }, [value]);
  const handlePress = () => {
    const _value = !state;
    if(state) return
    setState(_value);
    onChange && onChange(_value);
  };
  return (
    <Pressable
      className={`${state ? "bg-primary-c" : "bg-background-secondary"} rounded-full border-[0.5px] border-primary-border/10 px-4 py-v-1`}
      onPress={handlePress}
    >
      <Text
        className={`font-body text-sm ${false ? "text-background-primary" : "text-typography-primary"}`}
      >
        {title}
      </Text>
    </Pressable>
  );
};
