import React from "react";
import { SearchBar, SearchBarProps } from "../shared";
import { Box } from "lucide-react-native";

export interface PatientSeachBarProps extends SearchBarProps {}
export const PatientSeachBar: React.FC<PatientSeachBarProps> = ({
  fieldProps,
  ...props
}) => {
  return (
    <SearchBar
      fieldProps={{
        placeholder: "Rechercher un patient...",
        ...fieldProps,
      }}
      {...props}
    />
  );
};
