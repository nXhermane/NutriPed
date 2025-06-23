import { VStack } from "@/components/ui/vstack";
import React from "react";
import { SessionHeader } from "./shared/SessionHeader";
import { SessionEmpty } from "./shared/SessionEmpty";
import { PatientCard, PatientCardProps } from "../commun";
import { router } from "expo-router";
import { useLastPatientList } from "@/src/hooks";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";

export interface LastPatientSessionProps {}
export const LastPatientsSession: React.FC<LastPatientSessionProps> = ({}) => {
  const { patientList, onLoading } = useLastPatientList();

  return (
    <VStack>
      <SessionHeader
        title={"Last Patients"}
        actionName="See more"
        onActionPress={() => router.navigate("/(screens)/last_patient")}
      />
      {onLoading && (
        <Spinner size={"large"} className="mt-8" color={colors.blue["600"]} />
      )}

      {!onLoading && (
        <VStack className={"gap-3 pt-4"}>
          {patientList.length === 0 ? (
            <SessionEmpty
              message={"Aucun patient pour le moment."}
              iconName={"UserLock"}
            />
          ) : (
            patientList.slice(0, 3).map((item, index) => (
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
                      pathname: "/(screens)/patient_detail/[id]",
                      params: { id: item.id as string },
                    });
                }}
              />
            ))
          )}
        </VStack>
      )}
    </VStack>
  );
};
