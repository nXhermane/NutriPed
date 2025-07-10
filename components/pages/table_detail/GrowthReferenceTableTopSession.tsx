import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import React from "react";
import { Box } from "@/components/ui/box";

export interface GrowthReferenceTableTopSessionProps {
  tableName: string;
}

export const GrowthRefrenceTableTopSession: React.FC<
  GrowthReferenceTableTopSessionProps
> = ({ tableName }) => {
  return (
    <Box className="m-1 mb-3">
      <Heading className="text-center font-h4 text-base font-medium">
        {tableName}
      </Heading>
    </Box>
  );
};
