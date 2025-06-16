import {
  DiagnosticDataForm,
  PatientDetailHeader,
} from "@/components/pages/patient_detail";
import { Box } from "@/components/ui/box";
import { AggregateID } from "@/core/shared";
import { Interaction } from "@/src/store";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PatientDetail = () => {
  const { id: patientId } = useLocalSearchParams();
  const [
    showDiagnosticDataFormForFirstVisit,
    setShowDiagnosticDataFormForFirstVisist,
  ] = useState<boolean>(false);
  const patientInteractionList: Interaction[] = useSelector(
    (state: any) => state.patientInteractionReducer.interactions
  );

  useEffect(() => {
    const checkIfItFirstVisit = () => {
      const patientInteraction = patientInteractionList.find(
        interaction => interaction.patientId === patientId
      );
      if (patientInteraction) {
        setShowDiagnosticDataFormForFirstVisist(
          patientInteraction.isFirstVisitToPatientDetail
        );
        console.log(patientInteraction)
      }
    };
    checkIfItFirstVisit();
  }, [patientInteractionList]);

  return (
    <Box className={"flex-1 bg-background-primary"}>
      <PatientDetailHeader patientId={patientId as AggregateID} />
      <DiagnosticDataForm
        patientId={patientId as AggregateID}
        isOpen={showDiagnosticDataFormForFirstVisit}
        onClose={() => setShowDiagnosticDataFormForFirstVisist(false)}
      />
    </Box>
  );
};

export default PatientDetail;
