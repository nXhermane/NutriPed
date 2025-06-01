import { Box } from "@/components/ui/box"
import { MokedPatientList } from "@/data"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { PatientCard, PatientCardProps } from "../commun"
import { SessionEmpty } from "../home/shared/SessionEmpty"
import { Fab, FabIcon } from "@/components/ui/fab"
import { UserPlus } from "lucide-react-native"
import { ActionBtnSession } from "./ActionsSession"

export interface PatientListSessionProps {
    useMoked?: boolean
}
export const PatientListSession: React.FC<PatientListSessionProps> = ({ useMoked = false }) => {
    const [hideFab, setHideFab] = useState<boolean>(false)
    const [patientList, setPatientList] = useState<typeof MokedPatientList>([])
    const [selectedItem, setSelectedItem] = useState<number[]>([])
    useEffect(() => {
        if (useMoked) {
            setPatientList(MokedPatientList.concat(MokedPatientList).concat(MokedPatientList))
        }
    }, [useMoked])


    return <Box className="h-full max-h-[65%]">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 py-1 pb-v-10" onMomentumScrollEnd={() => setHideFab(false)} onScroll={() => setHideFab(true)}>
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
                        onChange={(value: boolean) => {
                            setSelectedItem(prev => {
                                const findedIndex = prev.indexOf(index)
                                if (findedIndex === -1 && value) {
                                    return [...prev, index]
                                }
                                return prev.filter(value => value != index)
                            })

                        }}
                    />
                ))
            )}


        </ScrollView>
        {(!hideFab && selectedItem.length === 0) && <Fab
            placement="bottom right"
            className="bg-primary-c h-11 w-11 mb-4 -mr-2"
        >
            <FabIcon as={UserPlus} className="text-typography-primary h-6 w-6" />
        </Fab>}
        {selectedItem.length != 0 && <ActionBtnSession />}
    </Box>

}