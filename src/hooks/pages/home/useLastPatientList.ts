import { usePediatricApp } from "@/adapter";
import { PatientCardInfo } from "@/components/pages/commun";
import { Message } from "@/core/shared";
import { PATIENT_STATE } from "@/src/constants/ui";
import { Interaction } from "@/src/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useLastPatientList() {
    const { patientService } = usePediatricApp();
    const [patientList, setPatientList] = useState<PatientCardInfo[]>(
        []
    );
    const patientInteractionList: Interaction[] = useSelector(
        (state: any) => state.patientInteractionReducer.interactions
    );

    useEffect(() => {
        const getPatientList = async () => {
            const patientLastInteractions = patientInteractionList
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            const patients = await Promise.all(
                patientLastInteractions.map(patient =>
                    patientService.get({ id: patient.patientId })
                )
            );
            const lists: PatientCardInfo[] = [];
            for (const patientRes of patients) {
                if (!(patientRes instanceof Message)) {
                    const patientDto = patientRes.data[0];
                    lists.push({
                        birthday: patientDto.birthday,
                        name: patientDto.name,
                        createdAt: patientDto.registrationDate,
                        status:
                            patientLastInteractions.find(
                                interaction => interaction.patientId === patientDto.id
                            )?.state || PATIENT_STATE.NORMAL,
                        id: patientDto.id,
                    });
                }
            }
            setPatientList(lists);
        };

        getPatientList();
    }, [patientInteractionList]);
    return patientList
}


