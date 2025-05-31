import { IVStackProps, VStack } from "@/components/ui/vstack";
import React, { ReactNode } from "react";
export interface PageBodyProps extends IVStackProps {}
export const PageBody: React.FC<PageBodyProps> = ({ children, ...props }) => {
  return (
    <VStack className={"gap-v-4 px-4 py-v-3 overflow-visible w-full h-full"} {...props}>
      {children}
    </VStack>
  );
};
