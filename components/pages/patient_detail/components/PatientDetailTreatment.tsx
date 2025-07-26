import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";
import { InitPatientRootSecure } from "./InitPatientRootSecure";

export interface PatientDetailTreatmentProps {}

export const PatientDetailTreatmentComponent: React.FC<
  PatientDetailTreatmentProps
> = ({}) => {
  return (
    <VStack>
      <Text>This is the patient treatment detail screen</Text>
    </VStack>
  );
};

export const PatientDetailTreatment: React.FC<
  PatientDetailTreatmentProps
> = props => {
  return (
    <InitPatientRootSecure>
      <PatientDetailTreatmentComponent {...props} />
    </InitPatientRootSecure>
  );
};
