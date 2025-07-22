import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";
import { InitPatientRootSecure } from "./InitPatientRootSecure";

export interface PatientDetailOverviewsProps {}

export const PatientDetailOverviews: React.FC<
  PatientDetailOverviewsProps
> = ({}) => {
  return (
    <InitPatientRootSecure>
      <VStack className="flex-1 bg-background-primary"></VStack>
    </InitPatientRootSecure>
  );
};
