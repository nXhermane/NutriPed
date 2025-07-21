import { PatientDetail } from "@/components/pages/patient_detail";
import { Interaction, recordInteraction } from "@/src/store";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PatientDetailScreen = () => {
  const { id: patientId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const isNotify = useRef<boolean>(false);
  const patientInteractionList: Interaction[] = useSelector(
    (state: any) => state.patientInteractionReducer.interactions
  );
  const [currentPatientInteraction, setCurrentPatientInteraction] =
    useState<Interaction | null>(null);
  useEffect(() => {
    const patientInteraction = patientInteractionList.find(
      interaction => interaction.patientId === patientId
    );
    if (patientInteraction) {
      setCurrentPatientInteraction(patientInteraction);
    }
  }, [patientInteractionList]);
  useEffect(() => {
    if (currentPatientInteraction && !isNotify.current) {
      dispatch(
        recordInteraction({
          patientId: currentPatientInteraction?.patientId!,
          isFirstVisitToPatientDetail:
            currentPatientInteraction?.isFirstVisitToPatientDetail!,
          date: new Date().toISOString(),
          state: currentPatientInteraction?.state!,
        })
      );
      isNotify.current = true;
    }
  }, [currentPatientInteraction]);
  return (
    <React.Fragment>
      <PatientDetail
        id={patientId as string}
        patientInteraction={currentPatientInteraction}
      />
    </React.Fragment>
  );
};

export default PatientDetailScreen;
