import { Loading } from "@/components/custom";
import { FadeInCardX } from "@/components/custom/motion";
import { SessionEmpty } from "@/components/pages/home/shared/SessionEmpty";
import { DailyMedicalRecordDataComponent } from "@/components/pages/patient_detail";
import { InitPatientRootSecure } from "@/components/pages/patient_detail/components/InitPatient";
import { FilterChips, StackScreenHeader } from "@/components/pages/shared";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import {
  useMedicalRecord,
  useOrdoredMedicalRecordDataByDay,
} from "@/src/hooks";
import {
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "@/utils";
import React from "react";
import { useMemo, useState } from "react";
import { FlatList } from "react-native";

const Monitoring = () => {
  const { data, error, onLoading } = useMedicalRecord();
  const ordoredMedicalRecordData = useOrdoredMedicalRecordDataByDay(data);
  const [filterTag, setFilterTag] = useState<
    "all" | "today" | "thisWeek" | "thisMonth"
  >("all");
  const filteredList = useMemo(() => {
    if (ordoredMedicalRecordData.length == 0) return [];
    if (filterTag === "all") return ordoredMedicalRecordData;
    return ordoredMedicalRecordData.filter(value => {
      const now = new Date();
      switch (filterTag) {
        case "today":
          return isSameDay(value.recordDate, now);
        case "thisWeek":
          const weekStart = startOfWeek(now);
          const weekEnd = endOfWeek(now);
          return value.recordDate >= weekStart && value.recordDate <= weekEnd;
        case "thisMonth":
          const monthStart = startOfMonth(now);
          const monthEnd = endOfMonth(now);
          return value.recordDate >= monthStart && value.recordDate <= monthEnd;
        default:
          console.warn(
            `This tag (${filterTag}) is not supported to filter the medical record Data`
          );
          return true;
      }
    });
  }, [ordoredMedicalRecordData, filterTag]);
  if (onLoading) return <Loading />;

  return (
    <VStack className="flex-1 bg-background-primary">
      <VStack className="overflow-visible py-3">
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
      <FlatList
        removeClippedSubviews
        contentContainerClassName="pb-v-4"
        data={filteredList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeInCardX delayNumber={index} key={index}>
            <DailyMedicalRecordDataComponent
             
              data={item}
              key={index}
            />
          </FadeInCardX>
        )}
        ItemSeparatorComponent={() => <Box className="h-v-4 w-full" />}
        ListEmptyComponent={() => {
          return (
            <SessionEmpty
              iconName="SearchSlash"
              message="Aucun enregistrement de données médicales trouvés."
            />
          );
        }}
      />
    </VStack>
  );
};

export default function Route() {
  return (
    <React.Fragment>
      <StackScreenHeader name="Liste des mesures" />
      <InitPatientRootSecure>
        <Monitoring />
      </InitPatientRootSecure>
    </React.Fragment>
  );
}
