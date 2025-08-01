import { createContext } from "react";

export interface AddDataToMedicalRecordModalContextType {
  close: () => void;
}

export const AddDataToMedicalRecordModalContext =
  createContext<AddDataToMedicalRecordModalContextType>({
    close: () => void 0,
  } as AddDataToMedicalRecordModalContextType);
