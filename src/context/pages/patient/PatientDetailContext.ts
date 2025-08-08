import { PatientDto } from "@/core/patient";
import { Interaction } from "@/src/store";
import { createContext, useContext } from "react";

export interface PatientDetailContextType {
  patient: PatientDto;
  interaction: Interaction;
}

export const PatientDetailContext = createContext<PatientDetailContextType>(
  {} as PatientDetailContextType
);

export function usePatientDetail() {
  const context = useContext(PatientDetailContext);
  if (!context)
    throw new Error(
      "The usePatientDetail must be called inside of PatientDetailProvider."
    );

  return context;
}
