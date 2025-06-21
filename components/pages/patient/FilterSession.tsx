import { useEffect, useState } from "react";
import {
  PATIENT_QUICK_FILTER_ITEMS,
  PATIENT_QUICK_FILTER_TAG,
} from "@/src/constants/ui";
import { FilterChips } from "../shared";

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
    <FilterChips
      data={PATIENT_QUICK_FILTER_ITEMS.map(item => ({
        label: item.title,
        value: item.tag,
      }))}
      onChange={value => setSelectedTag(value as PATIENT_QUICK_FILTER_TAG)}
      value={selectedTag}
    />
  );
};