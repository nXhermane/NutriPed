import { VStack } from "@/components/ui/vstack";
import React from "react";
import { SessionHeader } from "./shared/SessionHeader";
import { SessionEmpty } from "./shared/SessionEmpty";
import { PatientCard, PatientCardProps } from "../commun";
import { router } from "expo-router";
import { useLastPatientList } from "@/src/hooks";
import { FadeInCardY } from "@/components/custom/motion";
import { Loading } from "@/components/custom";

export interface LastPatientSessionProps {}
export const LastPatientsSession: React.FC<LastPatientSessionProps> = ({}) => {
  const { patientList, onLoading } = useLastPatientList();

  return (
    <VStack>
      <SessionHeader
        title={"Derniers Patients"}
        actionName="Voir plus"
        onActionPress={() => router.navigate("/(screens)/last_patient")}
      />
      {onLoading && <Loading />}

      {!onLoading && (
        <VStack className={"gap-3 pt-4"}>
          {patientList.length === 0 ? (
            <SessionEmpty
              message={"Aucun patient pour le moment."}
              iconName={"UserLock"}
            />
          ) : (
            patientList.slice(0, 3).map((item, index) => (
              <FadeInCardY delayNumber={index + 4} key={index}>
                <PatientCard
                  name={item.name}
                  createdAt={item.createdAt}
                  status={item.status as PatientCardProps["status"]}
                  key={index}
                  birthday={item.birthday}
                  nextVisitDate={item.nextVisitDate}
                  onPress={() => {
                    item.id &&
                      router.push({
                        pathname: "/(screens)/[patientId]",
                        params: { patientId: item.id as string },
                      });
                  }}
                />
              </FadeInCardY>
            ))
          )}
        </VStack>
      )}
    </VStack>
  );
};
