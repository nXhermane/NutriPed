import { VStack } from "@/components/ui/vstack";
import React from "react";
import { InitPatientRootSecure } from "./InitPatient";

export interface PatientDetailOverviewsProps {}

const PatientDetailOverviewsComponent: React.FC<
  PatientDetailOverviewsProps
> = ({}) => {
  return <VStack className="flex-1 bg-background-primary"></VStack>;
};
export const PatientDetailOverviews: React.FC<
  PatientDetailOverviewsProps
> = props => {
  return (
    <InitPatientRootSecure>
      <PatientDetailOverviewsComponent {...props} />
    </InitPatientRootSecure>
  );
};
