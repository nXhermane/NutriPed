import { PatientDto } from "@/core/patient";
import { Interaction } from "@/src/store";
import { createContext } from "react";

export interface PatientDetailContextType {
  patient: PatientDto;
  interaction: Interaction;
}

export const PatientDetailContext = createContext<PatientDetailContextType>(
  {} as PatientDetailContextType
);