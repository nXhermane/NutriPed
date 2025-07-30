import { useEffect, useMemo, useState } from "react";
import { MedicalRecordDto } from "@/core/medical_record";

export type MedicalRecordDataOrdoredByDay = {
    recordDate: Date;
    anthrop: MedicalRecordDto["anthropometricData"];
    clinical: MedicalRecordDto["clinicalData"];
    biological: MedicalRecordDto["biologicalData"];
    complication: MedicalRecordDto["complicationData"];
}[];

export function useOrdoredMedicalRecordDataByDay(medicalRecord?: MedicalRecordDto) {
    const [orderedData, setOrderedData] = useState<MedicalRecordDataOrdoredByDay>([]);

    const iterateAndGroupByDate = useMemo(() => {
        return <T extends { recordedAt: string }>(
            accumulator: { [date: string]: MedicalRecordDataOrdoredByDay[number] },
            dataArray: T[],
            key: keyof Omit<MedicalRecordDataOrdoredByDay[number], 'recordDate'>
        ) => {
            for (const item of dataArray) {
                const date = item.recordedAt;
                if (!accumulator[date]) {
                    accumulator[date] = {
                        recordDate: new Date(date),
                        anthrop: [],
                        clinical: [],
                        biological: [],
                        complication: []
                    };
                }
                accumulator[date][key].push(item as any);
            }
        };
    }, []);

    useEffect(() => {
        if (!medicalRecord) return;

        const { anthropometricData, biologicalData, clinicalData, complicationData } = medicalRecord;
        const groupedData: { [date: string]: MedicalRecordDataOrdoredByDay[number] } = {};

        iterateAndGroupByDate(groupedData, anthropometricData, 'anthrop');
        iterateAndGroupByDate(groupedData, clinicalData, 'clinical');
        iterateAndGroupByDate(groupedData, biologicalData, 'biological');
        iterateAndGroupByDate(groupedData, complicationData, 'complication');

        // Transformer en tableau trié
        const sortedArray: MedicalRecordDataOrdoredByDay = Object.values(groupedData).sort(
            (a, b) => b.recordDate.getTime() - a.recordDate.getTime()
        );

        setOrderedData(sortedArray);
    }, [medicalRecord, iterateAndGroupByDate]);

    return orderedData;
}
