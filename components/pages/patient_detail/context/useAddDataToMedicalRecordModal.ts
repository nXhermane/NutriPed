import { useContext } from "react";
import { AddDataToMedicalRecordModalContext } from "./AddDataToMedicalRecordModalContext";


export function useAddDataToMedicalRecordModal() {
  const context = useContext(AddDataToMedicalRecordModalContext);
  if (!context)
    throw new Error(
      "The useAddDataToMedicalRecordModal must be called inside of AddDataToMedicalRecordModal."
    );

  return context;
}
