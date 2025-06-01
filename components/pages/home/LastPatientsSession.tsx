import { VStack } from "@/components/ui/vstack";
import React, { useEffect, useState } from "react";
import { SessionHeader } from "./shared/SessionHeader";
import { SessionEmpty } from "./shared/SessionEmpty";
import { PatientCard, PatientCardProps } from "../commun";
import { MokedPatientList } from "@/data";

export interface LastPatientSessionProps {
  useMoked?: boolean;
}
export const LastPatientsSession: React.FC<LastPatientSessionProps> = ({
  useMoked = false,
}) => {
  const [patientList, setPatientList] = useState<any[]>(
    useMoked ? MokedPatientList : []
  );

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
