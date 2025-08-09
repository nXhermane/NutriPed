import { Loading } from "@/components/custom";
import { GetPatientRequest } from "@/core/patient";
import { useToast } from "@/src/context";
import { PatientDetailContext } from "@/src/context/pages";
import { usePatients } from "@/src/hooks";
import { Interaction, recordInteraction } from "@/src/store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Layout() {
  const toast = useToast();
  const dispatch = useDispatch();
  const isNotify = useRef<boolean>(false);

  const [currentPatientInteraction, setCurrentPatientInteraction] =
    useState<Interaction | null>(null);

  const { patientId } = useLocalSearchParams<{ patientId: string }>();

  const getPatientRequest = useMemo<GetPatientRequest>(
    () => ({ id: patientId }),
    [patientId]
  );
  const { data, error, onLoading } = usePatients(getPatientRequest);

  const patientInteractionList: Interaction[] = useSelector(
    (state: any) => state.patientInteractionReducer.interactions
  );

  useEffect(() => {
    const patientInteraction = patientInteractionList.find(
      interaction => interaction.patientId === getPatientRequest.id
    );
    if (patientInteraction) {
      setCurrentPatientInteraction(patientInteraction);
    }
  }, [getPatientRequest, patientInteractionList]);

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
  }, [currentPatientInteraction, dispatch]);

  useEffect(() => {
    if (error) {
      toast.show(
        "Error",
        "Une Erreur technique s'est produite viellez reessayer."
      );
      setTimeout(() => router.back(), 300);
    }
  }, [error]);

  if (data.length === 0 || onLoading || !currentPatientInteraction)
    return <Loading />;

  return (
    <PatientDetailContext.Provider
      value={{
        patient: data[0],
        interaction: currentPatientInteraction,
      }}
    >
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            presentation: "containedModal",
            animation: "fade_from_bottom",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="monitoring" />
        </Stack>
      </BottomSheetModalProvider>
    </PatientDetailContext.Provider>
  );
}
