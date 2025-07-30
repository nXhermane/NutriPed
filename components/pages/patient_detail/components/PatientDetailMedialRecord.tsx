import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";
import { useDailyCareJournals, useMedicalRecord } from "@/src/hooks";
import { InitPatientRootSecure } from "./InitPatientRootSecure";
import { Loading } from "@/components/custom";
import { useOrdoredMedicalRecordDataByDay } from "@/src/hooks/pages/patient_detail/useOrdoredMedicalRecordDataByDay";
import { FlatList } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { FadeInCardY } from "@/components/custom/motion";
import { DailyMedicalRecordDataComponent } from "./DailyMedicalRecord";
import { Box } from "@/components/ui/box";
import { FilterChips } from "../../shared";

export interface PatientDetailMedicalRecordProps {}

const PatientDetailMedicalRecordComponent: React.FC<
  PatientDetailMedicalRecordProps
> = ({}) => {
  const { data, error, onLoading } = useMedicalRecord();
  const ordoredMedicalRecordData = useOrdoredMedicalRecordDataByDay(data);
  const [filterTag, setFilterTag] = useState<
    "all" | "today" | "thisWeek" | "thisMonth"
  >("all");
  if (onLoading) return <Loading />;

  return (
    <VStack className="flex-1 bg-background-primary">
      <VStack className="overflow-visible py-3 pl-4">
        <FilterChips<typeof filterTag>
          data={[
            { label: "Toutes", value: "all" },
            { label: "Aujourd'hui", value: "today" },
            { label: "Cette semaine", value: "thisWeek" },
            { label: "Ce mois", value: "thisMonth" },
          ]}
          value={filterTag}
          onChange={tag => setFilterTag(tag)}
        />
      </VStack>

      <FlashList
        removeClippedSubviews
        contentContainerClassName="p-4"
        data={ordoredMedicalRecordData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeInCardY delayNumber={index} key={item.recordDate.toDateString()}>
            <DailyMedicalRecordDataComponent data={item} />
          </FadeInCardY>
        )}
        ItemSeparatorComponent={() => <Box className="h-v-4 w-full" />}
      />
    </VStack>
  );
};

export const PatientDetailMedicalRecord = () => {
  return (
    <InitPatientRootSecure>
      <PatientDetailMedicalRecordComponent />
    </InitPatientRootSecure>
  );
};
