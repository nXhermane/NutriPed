import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
export const PATIENT_MOKED_STATS = [
  {
    value: 24,
    tag: "Total",
  },
  {
    value: 4,
    tag: "Nouveaux",
  },
  {
    value: 5,
    tag: "Attention",
  },
  {
    value: 15,
    tag: "Normal",
  },
];

export interface PatientStatSessionProps {
  useMoked?: boolean;
}
export const PatientStatSession: React.FC<PatientStatSessionProps> = ({
  useMoked = true,
}) => {
  const [patientStats, setPatientStats] = useState<
    { value: number; tag: string }[]
  >([]);
  useEffect(() => {
    if (useMoked) {
      setPatientStats(PATIENT_MOKED_STATS);
    } else {
      setPatientStats([
        {
          value: 0,
          tag: "All",
        },
        {
          value: 0,
          tag: "New",
        },
        {
          value: 0,
          tag: "Attention",
        },
        {
          value: 0,
          tag: "Normal",
        },
      ]);
    }
  }, [useMoked]);
  return (
    <HStack className={"overflow-visible"}>
      <ScrollView
        horizontal
        contentContainerClassName="gap-3 overflow-visible"
        className={"overflow-visible"}
        showsHorizontalScrollIndicator={false}
      >
        {patientStats.map((item, index) => (
          <PatientStatCard key={index} value={item.value} desc={item.tag} />
        ))}
      </ScrollView>
    </HStack>
  );
};

export interface PatientStatCardProps {
  value: number;
  desc: string;
}
export const PatientStatCard: React.FC<PatientStatCardProps> = ({
  value,
  desc,
}) => {
  return (
    <VStack
      className={
        "h-v-16 w-20 items-center justify-center rounded-md border-[0.5px] border-primary-border/10 bg-background-secondary"
      }
    >
      <Heading className={"font-h2 text-2xl text-primary-c"}>{value}</Heading>
      <Text
        className={"font-body text-xs uppercase text-typography-primary_light"}
      >
        {desc}
      </Text>
    </VStack>
  );
};
