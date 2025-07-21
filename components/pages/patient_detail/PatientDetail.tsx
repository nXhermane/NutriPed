import { Loading } from "./../../custom";
import { VStack } from "./../../ui/vstack";
import { usePatients } from "@/src/hooks";
import { useEffect, useMemo } from "react";
import { Interaction } from "@/src/store";
import { PatientDetailHeader } from "./components/PatientDetailHeader";
import { PatientDetailBody } from "./components/PatientDetailBody";
import { PatientDetailContext } from "./context";
import { useToast } from "@/src/context";
import { router } from "expo-router";

export interface PatientDetailProps {
  id: string;
  patientInteraction: Interaction | null;
}

export function PatientDetail({ id, patientInteraction }: PatientDetailProps) {
  const getPatientRequest = useMemo(() => ({ id }), [id]);
  const { data, error, onLoading } = usePatients(getPatientRequest);
  const toast = useToast();
  useEffect(() => {
    if (error) {
      toast.show(
        "Error",
        "Une Erreur technique s'est produite viellez reessayer."
      );
      setTimeout(() => router.back(), 300);
    }
  }, [error]);
  if (data.length === 0 || onLoading || !patientInteraction) return <Loading />;

  return (
    <PatientDetailContext.Provider
      value={{
        patient: data[0],
        interaction: patientInteraction,
      }}
    >
      <VStack className="flex-1 bg-background-primary">
        <PatientDetailHeader />
        <PatientDetailBody />
      </VStack>
    </PatientDetailContext.Provider>
  );
}
