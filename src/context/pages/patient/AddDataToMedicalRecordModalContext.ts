import { createContext, useContext } from "react";

export interface AddDataToMedicalRecordModalContextType {
  close: () => void;
}

export const AddDataToMedicalRecordModalContext =
  createContext<AddDataToMedicalRecordModalContextType>({
    close: () => void 0,
  } as AddDataToMedicalRecordModalContextType);

export function useAddDataToMedicalRecordModal() {
  const context = useContext(AddDataToMedicalRecordModalContext);
  if (!context)
    throw new Error(
      "The useAddDataToMedicalRecordModal must be called inside of AddDataToMedicalRecordModal."
    );

  return context;
}
