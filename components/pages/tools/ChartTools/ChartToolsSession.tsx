import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import React, { ReactNode } from "react";

export interface ChartToolsSessionProps {
  children?: ReactNode;
  title?: string;
  className?: string;
}

export const ChartToolsSession: React.FC<ChartToolsSessionProps> = ({
  children,
  title,
  className,
}) => {
  return (
    <VStack className={`gap-v-4 ${className}`}>
      {title && (
        <Heading
          className={
            "text-center font-h2 text-lg font-semibold text-typography-primary"
          }
        >
          {title}
        </Heading>
      )}
      {children && <Box>{children}</Box>}
    </VStack>
  );
};
