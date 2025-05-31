import { Box } from "@/components/ui/box"
import { MokedPatientList } from "@/data"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { PatientCard, PatientCardProps } from "../commun"
import { SessionEmpty } from "../home/shared/SessionEmpty"

export interface PatientListSessionProps {
    useMoked?: boolean
}
export const PatientListSession: React.FC<PatientListSessionProps> = ({ useMoked = false }) => {
    const [patientList, setPatientList] = useState<typeof MokedPatientList>([])
    useEffect(() => {
        if (useMoked) {
            setPatientList(MokedPatientList.concat(MokedPatientList).concat(MokedPatientList))
        }
    }, [useMoked])

    return <Box className="h-full max-h-[65%]">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 py-1 pb-v-10">
            {patientList.length === 0 ? (
                <SessionEmpty
                    message={"Aucun patient pour le moment."}
                    iconName={"UserLock"}
                />
            ) : (
                patientList.map((item, index) => (
                    <PatientCard
                        name={item.name}
                        createdAt={item.createdAt}
                        status={item.status as PatientCardProps["status"]}
                        key={index}
                        birthday={item.birthday}
                        nextVisitDate={item.nextVisitDate}
                        enableSelection
                        scaled={false}
                    />
                ))
            )}

        </ScrollView>
    </Box>

}