import { useContext } from "react";
import { PatientDetailContext } from "./PatientDetailContext";

export function usePatientDetail() {
  const context = useContext(PatientDetailContext);
  if (!context)
    throw new Error(
      "The usePatientDetail must be called inside of PatientDetailProvider."
    );

  return context;
}
