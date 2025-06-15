import {
  DiagnosticDataForm,
  PatientDetailHeader,
} from "@/components/pages/patient_detail";
import { Box } from "@/components/ui/box";
import { AggregateID } from "@/core/shared";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const PatientDetail = () => {
  const { id: patientId } = useLocalSearchParams();

  return (
    <Box className={"flex-1 bg-background-primary"}>
      <PatientDetailHeader patientId={patientId as AggregateID} />
      <DiagnosticDataForm patientId={patientId as AggregateID} />
    </Box>
  );
};

export default PatientDetail;
