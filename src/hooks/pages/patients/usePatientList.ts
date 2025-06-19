import { usePediatricApp } from "@/adapter";
import { PatientCardInfo } from "@/components/pages/commun";
import { Message } from "@/core/shared";
import { PATIENT_QUICK_FILTER_TAG, PATIENT_STATE } from "@/src/constants/ui";
import { AppDispatch, Interaction } from "@/src/store";
import { recordUiState } from "@/src/store/uiState";
import { A } from "@expo/html-elements";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export type PatientInfo = PatientCardInfo & {
    date: string
}
export function usePatientList(filterTag: PATIENT_QUICK_FILTER_TAG) {
    const [onLoading, setOnLoading] = useState<boolean>(false);
    const [patientList, setPatientList] = useState<PatientInfo[]>([]);
    const updatePatientList = useSelector(
        (state: any) => state.uiReducer.refreshPatientList
    );
    const patientInteractionList: Interaction[] = useSelector(
        (state: any) => state.patientInteractionReducer.interactions
    );
    const dispatch = useDispatch<AppDispatch>();
    const { patientService } = usePediatricApp();
    useEffect(() => {
        const getPatientList = async () => {
            setOnLoading(true);
            const patients = await patientService.get({});
            const lists: PatientInfo[] = [];
            if (!(patients instanceof Message)) {
                for (const patientDto of patients.data) {
                    const interaction = patientInteractionList.find(
                        interaction => interaction.patientId === patientDto.id
                    )
                    lists.push({
                        birthday: patientDto.birthday,
                        name: patientDto.name,
                        createdAt: patientDto.registrationDate,
                        status:
                            interaction?.state || PATIENT_STATE.NORMAL,
                        id: patientDto.id,
                        date: interaction?.date || new Date().toISOString()

                    });
                }
            }
            const $patientList = filterTag === PATIENT_QUICK_FILTER_TAG.ALL ? lists : filterTag === PATIENT_QUICK_FILTER_TAG.RECENT ? lists.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : lists.filter(patient => patient.status === filterTag as any)
            setPatientList($patientList);
            dispatch(recordUiState({ type: "PATIENT_REFRESHED" }));
            setOnLoading(false);
        };
        getPatientList();
    
    }, [updatePatientList,filterTag]);
    return { onLoading, patientList }
}