import { VStack } from "@/components/ui/vstack";
import React, { useEffect, useState } from "react";
import { SessionHeader } from "./shared/SessionHeader";
import { SessionEmpty } from "./shared/SessionEmpty";
import { PatientCard, PatientCardInfo, PatientCardProps } from "../commun";
import { MokedPatientList } from "@/data";
import { useSelector } from "react-redux";
import { usePediatricApp } from "@/adapter";
import { Interaction } from "@/src/store";
import { Message } from "@/core/shared";
import { PATIENT_STATE } from "@/src/constants/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LastPatientSessionProps {
  useMoked?: boolean;
}
export const LastPatientsSession: React.FC<LastPatientSessionProps> = ({
  useMoked = false,
}) => {
  const { patientService } = usePediatricApp();
  const [patientList, setPatientList] = useState<PatientCardInfo[]>(
    useMoked ? MokedPatientList : []
  );
  const patientInteractionList: Interaction[] = useSelector(
    (state: any) => state.patientInteractionReducer.interactions
  );
  useEffect(() => {
    const getPatientList = async () => {
      const patientLastInteractions = patientInteractionList
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
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

  useEffect(() => {
    if (useMoked) setPatientList(MokedPatientList.slice(0, 3));
  }, [useMoked]);
  return (
    <VStack>
      <SessionHeader
        title={"Last Patients"}
        actionName="See more"
        onActionPress={() =>
          console.warn("Implement navigate to patients screens")
        }
      />
      <VStack className={"gap-3 pt-4"}>
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
            />
          ))
        )}
      </VStack>
    </VStack>
  );
};
