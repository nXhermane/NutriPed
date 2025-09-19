import { IVStackProps, VStack } from "@/components/ui/vstack";
import React, { ReactNode } from "react";
export interface PageBodyProps extends IVStackProps {}
export const PageBody: React.FC<PageBodyProps> = ({ children, ...props }) => {
  return (
    <VStack
      className={"h-full w-full gap-v-4 overflow-visible px-4 py-v-3"}
      {...props}
    >
      {children}
    </VStack>
  );
};
