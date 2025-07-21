import { usePediatricApp } from "@/adapter";
import { GetPatientRequest, PatientDto } from "@/core/patient";
import { useEffect, useState } from "react";

export function usePatients(req?: GetPatientRequest) {
    const { patientService } = usePediatricApp()
    const [patientList, setPatientList] = useState<PatientDto[]>([])
    const [error, setError] = useState<string | null>(null);
    const [onLoading, setOnLoading] = useState<boolean>(false);
    useEffect(() => {
        
        const getPatients = async () => {
            setError(null);
            setOnLoading(true);
            const result = await patientService.get(req ? req : {});
            if ("data" in result) setPatientList(result.data);
            else {
                console.error(JSON.parse(result.content));
                setError(JSON.parse(result.content));
            }
            setOnLoading(false);
        };
        getPatients();
    }, [req]);


    return { data: patientList, error, onLoading }
}