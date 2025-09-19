import {
  SessionHeader,
  SessionHeaderProps,
} from "@/components/pages/home/shared/SessionHeader";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import React, { PropsWithChildren } from "react";

export interface PatientDetailMedicalRecordSessionProps
  extends PropsWithChildren,
    SessionHeaderProps {}

export const PatientDetailMedicalRecordSession: React.FC<
  PatientDetailMedicalRecordSessionProps
> = ({ children, ...props }) => {
  return (
    <VStack className="">
      <VStack className="px-4 py-v-3">
        <SessionHeader {...props} />
      </VStack>

      {children && children}
    </VStack>
  );
};
