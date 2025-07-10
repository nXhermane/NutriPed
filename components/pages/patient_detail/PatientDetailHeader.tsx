import { usePediatricApp } from "@/adapter";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AggregateID, Message, Sex } from "@/core/shared";
import { HumanDateFormatter } from "@/utils";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";

export interface PatientDetailHeaderProps {
  patientId: AggregateID;
}

type PatientInfo = {
  id: AggregateID;
  name: string;
  birthday: string;
  createdAt: string;
  gender: Sex;
};
export const PatientDetailHeader: React.FC<PatientDetailHeaderProps> = ({
  patientId,
}) => {
  const { patientService } = usePediatricApp();
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [onError, setOnError] = useState<boolean>(false);
  useEffect(() => {
    const getPatientInfo = async () => {
      setOnError(false);
      const patient = await patientService.get({ id: patientId });
      if (patient instanceof Message) {
        setOnError(true);
      } else {
        const { birthday, id, gender, name, createdAt } = patient.data[0];
        setPatientInfo({
          id,
          birthday,
          createdAt,
          name,
          gender: gender as Sex,
        });
      }
    };
    getPatientInfo();
  }, [patientId]);
  if (patientInfo === null) return null;
  return (
    <VStack className={"p-safe h-v-52 bg-background-secondary pb-4"}>
      <HStack className={"px-2 py-4"}>
        <Pressable onPress={() => router.back()}>
          <Icon
            as={ChevronLeft}
            className={"h-7 w-7 text-typography-primary"}
          />
        </Pressable>
      </HStack>
      <VStack className={"h-fit gap-3"}>
        <Center>
          <Avatar className={"h-16 w-16"}>
            <AvatarFallbackText>{patientInfo.name}</AvatarFallbackText>
          </Avatar>
        </Center>
        <VStack className={"gap-0"}>
          <Center>
            <Heading className={"font-h3 text-xl text-typography-primary"}>
              {patientInfo?.name}
            </Heading>
          </Center>
          <HStack className={"items-center justify-center gap-2"}>
            <Text
              className={"font-light text-sm text-typography-primary_light"}
            >
              {HumanDateFormatter.toAge(patientInfo.birthday)}
            </Text>
            <Divider
              className={"h-1 w-1 rounded-full bg-typography-primary_light"}
            />
            <Text
              className={"font-light text-sm text-typography-primary_light"}
            >
              {HumanDateFormatter.toFollowUpDate(patientInfo?.createdAt)}
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};
