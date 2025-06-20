import { CardPressEffect } from "@/components/custom/motion";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { BadgeText, Badge } from "@/components/ui/badge";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React, { useEffect, useState } from "react";
import { PATIENT_STATE } from "@/src/constants/ui";
import { HumanDateFormatter } from "@/utils";
import { AggregateID } from "@/core/shared";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export interface PatientCardInfo {
  id?: AggregateID;
  name: string;
  createdAt: string;
  status: PATIENT_STATE;
  birthday: string;
  nextVisitDate?: string;
}
export interface PatientCardProps extends PatientCardInfo {
  onPress?: () => void;
  onChange?: (value: boolean) => void;
  selected?: boolean;
  enableSelection?: boolean;
  enableQuickSelection?: boolean;
  scaled?: boolean;
  translate?: boolean;
}
const PatientCardComponent: React.FC<PatientCardProps> = ({
  name,
  createdAt,
  status,
  onPress = () => void 0,
  onChange = (value: boolean) => void 0,
  selected = false,
  enableSelection = false,
  enableQuickSelection = false,
  birthday,
  nextVisitDate,
  scaled = true,
  translate = undefined,
}) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const statusBackground =
    status == PATIENT_STATE.NEW
      ? "bg-info-100/40"
      : status == PATIENT_STATE.ATTENTION
        ? "bg-warning-100/40"
        : "bg-success-100/40";
  const statusColor =
    status == PATIENT_STATE.NEW
      ? "text-info-500"
      : status == PATIENT_STATE.ATTENTION
        ? "text-warning-500"
        : "text-success-500";
  const handleSelection = () => {
    if (!enableSelection) return;
    const _value = !isSelected;
    setIsSelected(_value);
    onChange && onChange(_value);
  };
  useEffect(() => {
    setIsSelected(selected);
  }, [selected]);
  return (
    <CardPressEffect
      scaled={scaled}
      translate={translate ? "y" : undefined}
      className="rounded-xl bg-background-secondary opacity-100"
      onPress={() => {
        if (enableQuickSelection) handleSelection();
        else onPress && onPress();
      }}
      onLongPress={() => handleSelection()}
    >
      <HStack
        className={`elevation-sm h-v-16 justify-between rounded-xl ${isSelected ? "border-[1px] border-primary-c bg-gray-100 dark:bg-primary-c/10" : "border-0 bg-background-secondary"} px-3`}
      >
        <HStack className={"items-center gap-2"}>
          <Center className={""}>
            <Avatar className={`h-10 w-10 ${statusBackground} rounded-lg`}>
              <AvatarFallbackText className={"font-h2 " + statusColor}>
                {name}
              </AvatarFallbackText>
            </Avatar>
          </Center>

          <VStack>
            <Text
              className={"font-h4 text-h3 font-medium text-typography-primary"}
            >
              {name}
            </Text>
            <Text
              className={"font-light text-2xs text-typography-primary_light"}
            >
              {HumanDateFormatter.toAge(birthday)} -{" "}
              {HumanDateFormatter.toFollowUpDate(createdAt)}
            </Text>
          </VStack>
        </HStack>
        <Center className={"gap-1"}>
          <Badge
            className={`${statusBackground} h-v-5 items-center rounded-lg p-0 px-2`}
          >
            <BadgeText
              className={`font-light text-2xs uppercase ${statusColor}`}
            >
              {status}
            </BadgeText>
          </Badge>
          {nextVisitDate && (
            <Text
              className={"font-light text-2xs text-typography-primary_light"}
            >
              RDV: {HumanDateFormatter.toRelativeDate(nextVisitDate, true)}{" "}
            </Text>
          )}
        </Center>
      </HStack>
    </CardPressEffect>
  );
};

export const PatientCardSkeleton = () => {
  return (
    <HStack
      className={"h-v-16 items-center gap-2 rounded-xl bg-background-100 px-2"}
    >
      <Skeleton variant={"circular"} className={"h-9 w-9"} />
      <VStack className={"gap-2"}>
        <SkeletonText _lines={1} className={"h-3 w-36"} />
        <SkeletonText _lines={1} className={"h-2 w-44"} />
      </VStack>
      <Center className={"absolute right-2 gap-1"}>
        <Skeleton variant={"rounded"} className={"h-v-4 w-14"} />
      </Center>
    </HStack>
  );
};

export const PatientCard = React.memo(PatientCardComponent);
