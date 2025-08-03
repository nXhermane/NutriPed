import { useContext } from "react";
import { DailyMedicalRecordDataActionModalContext } from "./DailyMedicalRecordDataActionModalContext";


export function useDailyMedicalRecordDataActionModal() {
    const context = useContext(DailyMedicalRecordDataActionModalContext);
    if (!context)
        throw new Error(
            "The useDailyMedicalRecordDataActionModal must be called inside of DailyMedicalRecordDataActionModalContext."
        );

    return context;
}
