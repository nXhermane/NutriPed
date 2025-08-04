import {
  PatientDetailBody,
  PatientDetailHeader,
} from "@/components/pages/patient_detail/components";
import { VStack } from "@/components/ui/vstack";
import React from "react";

const PatientDetailScreen = () => {
  return (
    <React.Fragment>
      <VStack className="flex-1 bg-background-primary">
        <PatientDetailHeader />
        <PatientDetailBody />
      </VStack>
    </React.Fragment>
  );
};

export default PatientDetailScreen;
