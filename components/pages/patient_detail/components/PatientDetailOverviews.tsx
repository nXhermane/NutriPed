import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";

export interface PatientDetailOverviewsProps {}

export const PatientDetailOverviews: React.FC<
  PatientDetailOverviewsProps
> = ({}) => {
  const {
    interaction: { isFirstVisitToPatientDetail },
  } = usePatientDetail();
  if (isFirstVisitToPatientDetail) return <InitPatient />;
  return <VStack className="flex-1 bg-background-primary"></VStack>;
};
