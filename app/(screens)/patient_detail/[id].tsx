import {
  DiagnosticDataForm,
  PatientDetailHeader,
} from "@/components/pages/patient_detail";
import { Box } from "@/components/ui/box";
import { AggregateID } from "@/core/shared";
import { AppDispatch, Interaction, recordInteraction } from "@/src/store";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PatientDetail = () => {
  const { id: patientId } = useLocalSearchParams();
  const [
    showDiagnosticDataFormForFirstVisit,
    setShowDiagnosticDataFormForFirstVisist,
  ] = useState<boolean>(false);
  const patientInteractionList: Interaction[] = useSelector(
    (state: any) => state.patientInteractionReducer.interactions
  );
  const [currentPatientInteraction, setCurrentPatientInteraction] =
    useState<Interaction | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkIfItFirstVisit = () => {
      const patientInteraction = patientInteractionList.find(
        interaction => interaction.patientId === patientId
      );
      if (patientInteraction) {
        setCurrentPatientInteraction(patientInteraction);
        setTimeout(() => {
          setShowDiagnosticDataFormForFirstVisist(
            patientInteraction.isFirstVisitToPatientDetail
          );
        }, 300);
      }
    };
    checkIfItFirstVisit();
  }, [patientInteractionList]);

  useEffect(() => {
    if (currentPatientInteraction) {
      dispatch(
        recordInteraction({
          patientId: currentPatientInteraction.patientId,
          isFirstVisitToPatientDetail:
            currentPatientInteraction.isFirstVisitToPatientDetail,
          date: new Date().toISOString(),
          state: currentPatientInteraction.state,
        })
      );
    }
  }, [currentPatientInteraction]);

  return (
    <React.Fragment>
      <Box className={"flex-1 bg-background-primary"}>
        <PatientDetailHeader patientId={patientId as AggregateID} />
        <DiagnosticDataForm
          patientId={patientId as AggregateID}
          isOpen={showDiagnosticDataFormForFirstVisit}
          onClose={() => {
            if (currentPatientInteraction?.isFirstVisitToPatientDetail) {
              router.back();
            }
            setShowDiagnosticDataFormForFirstVisist(false);
          }}
        />
      </Box>
    </React.Fragment>
  );
};

export default PatientDetail;
