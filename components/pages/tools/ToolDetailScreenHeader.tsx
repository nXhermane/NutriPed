import React from "react";
import { StackScreenHeader } from "../shared";

export interface ToolDetailScreenHeaderProps {
  name: string;
}

export const ToolDetailScreenHeader: React.FC<ToolDetailScreenHeaderProps> = ({
  name,
}) => {
  return <StackScreenHeader name={name} />;
};
