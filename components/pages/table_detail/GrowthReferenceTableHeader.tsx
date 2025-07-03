import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";

export interface GrowthRefrenceTableHeaderProps {}

export const GrowthReferenceTableHeader: React.FC<
  GrowthRefrenceTableHeaderProps
> = ({}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{"Taille (cm)"}</TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
  );
};
