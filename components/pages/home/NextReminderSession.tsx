import { VStack } from "@/components/ui/vstack";
import { SessionHeader } from "./shared/SessionHeader";
import { Box } from "@/components/ui/box";
import { SessionEmpty } from "./shared/SessionEmpty";
import { HStack } from "@/components/ui/hstack";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Stethoscope } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { CardPressEffect } from "@/components/custom/motion";
import React from "react";
import { router } from "expo-router";

export interface NextReminderSessionProps {
  useMoked?: boolean;
}

export const NextReminderSession: React.FC<NextReminderSessionProps> = ({
  useMoked = false,
}) => {
  const nextReminder = useMoked
    ? {
        dateAtString: "Today at 10:00 AM",
        title: "Nutrition Follow-up : Lucas",
      }
    : null;
  return (
    <VStack>
      <SessionHeader
        title={"Next Reminder"}
        actionName="See more"
        onActionPress={() => router.navigate("/home/reminders")}
      />
      <Box className={"gap-3 pt-4"}>
        {nextReminder === null ? (
          <SessionEmpty
            message={"Aucun rappel à venir."}
            iconName={"BellOff"}
          />
        ) : (
          <ReminderCard
            title={nextReminder?.title}
            dateAtString={nextReminder?.dateAtString}
          />
        )}
      </Box>
    </VStack>
  );
};
export interface ReminderCardProps {
  title?: string;
  dateAtString?: string;
}
export const ReminderCard: React.FC<ReminderCardProps> = ({
  title,
  dateAtString,
}) => {
  return (
    <CardPressEffect translate="x">
      <HStack
        className={
          "elevation-sm h-v-14 items-center gap-2 overflow-hidden rounded-xl bg-background-secondary px-2"
        }
      >
        <Box
          className={"absolute -ml-1 h-full w-2 bg-primary-c_light"}
        ></Box>
        <Avatar className={"h-10 w-10 bg-primary-c_light/40 rounded-lg"}>
          <Icon
            as={Stethoscope}
            className={"h-5 w-5 text-primary-c_light"}
          />
        </Avatar>
        <VStack>
          <Text className={"font-h4 font-semibold text-sm text-typography-primary"}>
            {title}
          </Text>
          <Text className={"font-light text-2xs text-typography-primary_light"}>
            {dateAtString}
          </Text>
        </VStack>
      </HStack>
    </CardPressEffect>
  );
};
