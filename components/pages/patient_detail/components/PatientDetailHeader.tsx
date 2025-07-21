import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { PATIENT_STATE } from "@/src/constants/ui";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { usePatientDetail } from "../context";

export function PatientDetailHeader() {
  const {
    patient: { name },
    interaction: { state },
  } = usePatientDetail();
  const statusBackground =
    state == PATIENT_STATE.NEW
      ? "bg-info-100/40"
      : state == PATIENT_STATE.ATTENTION
        ? "bg-warning-100/40"
        : "bg-success-100/40";
  const statusColor =
    state == PATIENT_STATE.NEW
      ? "text-info-500"
      : state == PATIENT_STATE.ATTENTION
        ? "text-warning-500"
        : "text-success-500";
  return (
    <HStack className="pt-safe dark:elevation-md h-v-20 w-full items-center justify-between bg-background-secondary px-4">
      <HStack className="items-center gap-2">
        <Pressable className="" onPress={() => router.back()}>
          <Icon as={ChevronLeft} className="h-7 w-7 text-typography-primary" />
        </Pressable>
        <Heading className="font-h2 text-lg font-bold text-typography-primary">
          {name}
        </Heading>
      </HStack>
      <Center>
        <Avatar className={`h-9 w-9 ${statusBackground}`}>
          <AvatarFallbackText className={`${statusColor}`}>
            {name}
          </AvatarFallbackText>
        </Avatar>
      </Center>
    </HStack>
  );
}
