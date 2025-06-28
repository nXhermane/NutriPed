import { FadeInCardX } from "@/components/custom/motion";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { PATIENT_STATE } from "@/src/constants/ui";
import { Interaction } from "@/src/store";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
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
  const patientInteractionList: Interaction[] = useSelector(
    (state: any) => state.patientInteractionReducer.interactions
  );

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
  useEffect(() => {
    const normalPatientLength = patientInteractionList.filter(
      patient => patient.state === PATIENT_STATE.NORMAL
    ).length;
    const newPatientLenght = patientInteractionList.filter(
      patient => patient.state === PATIENT_STATE.NEW
    ).length;
    const attentionPatientLenght = patientInteractionList.filter(
      patient => patient.state === PATIENT_STATE.ATTENTION
    ).length;
    const allPatient =
      normalPatientLength + newPatientLenght + attentionPatientLenght;
    setPatientStats([
      { value: allPatient, tag: "All" },
      { value: newPatientLenght, tag: "New" },
      { value: normalPatientLength, tag: "Normal" },
      { value: attentionPatientLenght, tag: "Attention" },
    ]);
  }, [patientInteractionList]);
  return (
    <HStack className={"overflow-visible"}>
      <ScrollView
        horizontal
        contentContainerClassName="gap-3 overflow-visible"
        className={"overflow-visible"}
        showsHorizontalScrollIndicator={false}
      >
        {patientStats.map((item, index) => (
          <FadeInCardX key={index} delayNumber={index + 3}>
            <PatientStatCard key={index} value={item.value} desc={item.tag} />
          </FadeInCardX>
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
