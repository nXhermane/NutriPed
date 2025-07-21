import { PatientDetail } from "@/components/pages/patient_detail";
import { Interaction, recordInteraction } from "@/src/store";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PatientDetailScreen = () => {
  const { id: patientId } = useLocalSearchParams();
  const dispatch = useDispatch();
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
    // return () => {
    //   dispatch(
    //     recordInteraction({
    //       patientId: patientInteraction?.patientId!,
    //       isFirstVisitToPatientDetail:
    //         patientInteraction?.isFirstVisitToPatientDetail!,
    //       date: new Date().toISOString(),
    //       state: patientInteraction?.state!,
    //     })
    //   );
    // };
  }, [patientInteractionList]);

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
