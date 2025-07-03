import { VStack } from "@/components/ui/vstack";
import React from "react";
import { TableListSession } from "./TableListSession";

export const TableTools = () => {
  return (
    <React.Fragment>
      <VStack className="flex-1 gap-v-4 bg-background-primary">
        <TableListSession />
      </VStack>
    </React.Fragment>
  );
};
