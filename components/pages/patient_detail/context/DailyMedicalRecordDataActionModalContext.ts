import { createContext } from "react";

export interface DailyMedicalRecordDataActionModalContextType {
  close: () => void;
}

export const DailyMedicalRecordDataActionModalContext =
  createContext<DailyMedicalRecordDataActionModalContextType>({
    close: () => void 0,
  } as DailyMedicalRecordDataActionModalContextType);
