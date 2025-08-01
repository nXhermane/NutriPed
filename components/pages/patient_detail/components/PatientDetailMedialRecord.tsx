import { VStack } from "@/components/ui/vstack";
import React, { useMemo, useState } from "react";
import { useMedicalRecord } from "@/src/hooks";
import { InitPatientRootSecure } from "./InitPatientRootSecure";
import { Loading } from "@/components/custom";
import { useOrdoredMedicalRecordDataByDay } from "@/src/hooks/pages/patient_detail/useOrdoredMedicalRecordDataByDay";
import { FadeInCardX } from "@/components/custom/motion";
import { DailyMedicalRecordDataComponent } from "./DailyMedicalRecord";
import { Box } from "@/components/ui/box";
import { FilterChips } from "../../shared";
import {
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
} from "@/utils";
import { SessionEmpty } from "../../home/shared/SessionEmpty";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Plus } from "lucide-react-native";
import { AddDataToMedicalRecordModal } from "./AddDataToMedicalRecordModal";
import { FlatList } from "react-native";

export interface PatientDetailMedicalRecordProps {}

const PatientDetailMedicalRecordComponent: React.FC<
  PatientDetailMedicalRecordProps
> = ({}) => {
  const [reloadMedicalRecord, setReloadMedicalRecord] = useState<number>(1);
  const [showAddDataModal, setShowAddDataModal] = useState<boolean>(false);
  const { data, error, onLoading } = useMedicalRecord(reloadMedicalRecord);
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
      <FlatList
        removeClippedSubviews
        contentContainerClassName="pb-v-4"
        data={filteredList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeInCardX delayNumber={index} key={item.recordDate.toDateString()}>
            <DailyMedicalRecordDataComponent data={item} key={index} />
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
      {!showAddDataModal && (
        <Fab
          className="bg-primary-c_light"
          onPress={() => setShowAddDataModal(true)}
        >
          <FabIcon as={Plus} className="h-5 w-5 text-white" />
        </Fab>
      )}
      <AddDataToMedicalRecordModal
        isVisible={showAddDataModal}
        onClose={() => {
          setShowAddDataModal(false);
          setReloadMedicalRecord(prev => prev + 1);
        }}
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
