import { createContext, useContext } from "react";

export interface DailyMedicalRecordDataActionModalContextType {
  close: () => void;
}

export const DailyMedicalRecordDataActionModalContext =
  createContext<DailyMedicalRecordDataActionModalContextType>({
    close: () => void 0,
  } as DailyMedicalRecordDataActionModalContextType);

export function useDailyMedicalRecordDataActionModal() {
  const context = useContext(DailyMedicalRecordDataActionModalContext);
  if (!context)
    throw new Error(
      "The useDailyMedicalRecordDataActionModal must be called inside of DailyMedicalRecordDataActionModalContext."
    );

  return context;
}
