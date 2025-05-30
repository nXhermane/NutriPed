import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { SessionHeader } from "./shared/SessionHeader";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Center } from "@/components/ui/center";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { BadgeText, Badge } from "@/components/ui/badge";
import { SessionEmpty } from "./shared/SessionEmpty";
import { CardPressEffect } from "@/components/custom/motion";

export const MokedPatientList = [
  {
    name: "Lucas Martin",
    createdAt: "12/04/2025",
    status: "Normal",
  },
  {
    name: "Thomas Dupuis",
    createdAt: "02/05/2025",
    status: "New",
  },
  {
    name: "Sarah Bouaziz",
    createdAt: "28/03/2025",
    status: "Attention",
  },
];
export interface LastPatientSessionProps {
  useMoked?: boolean;
}
export const LastPatientsSession: React.FC<LastPatientSessionProps> = ({
  useMoked = false,
}) => {
  const [pateintList, setPatientList] = useState<any[]>(
    useMoked ? MokedPatientList : []
  );
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
        {pateintList.length === 0 ? (
          <SessionEmpty message={"Aucun patient pour le moment."} iconName={'UserLock'} />
        ) : (
          pateintList.map((item, index) => (
            <PatientCard
              name={item.name}
              createdAt={item.createdAt}
              status={item.status as PatientCardProps["status"]}
              key={index}
            />
          ))
        )}
      </VStack>
    </VStack>
  );
};

export interface PatientCardProps {
  name: string;
  createdAt: string;
  status: "New" | "Normal" | "Attention";
  onPress?: () => void;
}
const PatientCard: React.FC<PatientCardProps> = ({
  name,
  createdAt,
  status,
  onPress = () => void 0,
}) => {
  const statusBackground =
    status == "New"
      ? "bg-info-100"
      : status == "Attention"
        ? "bg-warning-100"
        : "bg-success-100";
  return (
    <CardPressEffect
      scaled
      translate={undefined}
      className=""
      onPress={onPress}
    >
      <HStack
        className={
          "elevation-sm h-v-16 items-center gap-2 rounded-xl bg-background-secondary px-2"
        }
      >
        <Center>
          <Avatar className={`h-9 w-9 ${statusBackground}`}>
            <AvatarFallbackText className={"font-h2 text-typography-primary"}>
              {name}
            </AvatarFallbackText>
          </Avatar>
        </Center>

        <VStack>
          <Text className={"font-h4 text-sm text-typography-primary"}>
            {name}
          </Text>
          <Text className={"font-light text-xs text-typography-primary_light"}>
            Suivi depuis: {createdAt}
          </Text>
        </VStack>
        <Center className={"absolute right-2"}>
          <Badge
            className={`${statusBackground} h-v-4 items-center rounded-lg p-0 px-2`}
          >
            <BadgeText className={"font-light text-2xs normal-case"}>
              {status}
            </BadgeText>
          </Badge>
        </Center>
      </HStack>
    </CardPressEffect>
  );
};
