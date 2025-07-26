import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";
import { useDailyCareJournals, useMedicalRecord } from "@/src/hooks";
import { InitPatientRootSecure } from "./InitPatientRootSecure";
import { Loading } from "@/components/custom";

export interface PatientDetailMedicalRecordProps {}

const PatientDetailMedicalRecordComponent: React.FC<
  PatientDetailMedicalRecordProps
> = ({}) => {
  const { data, error, onLoading } = useMedicalRecord();
  const {
    data: dailyJournals,
    error: dailyJournalsError,
    onLoading: dailyJournalsOnLoading,
  } = useDailyCareJournals();

  if (onLoading || dailyJournalsOnLoading) return <Loading />;

  console.log(data, error);
  console.log("\n ", dailyJournals, dailyJournalsError);
  return <VStack></VStack>;
};

export const PatientDetailMedicalRecord = () => {
  return (
    <InitPatientRootSecure>
      <PatientDetailMedicalRecordComponent />
    </InitPatientRootSecure>
  );
};
