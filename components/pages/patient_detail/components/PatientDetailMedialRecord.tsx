import { VStack } from "@/components/ui/vstack";
<<<<<<< HEAD
import React, { useCallback, useState } from "react";
import {
  MedicalRecordDataOrdoredByDay,
  useMedicalRecord,
  useOrdoredMedicalRecordDataByDay,
} from "@/src/hooks";
import { Loading } from "@/components/custom";
import { FadeInCardX } from "@/components/custom/motion";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Plus } from "lucide-react-native";
=======
import React, { useMemo, useState } from "react";
import { useMedicalRecord } from "@/src/hooks";
import { Loading } from "@/components/custom";
import { useOrdoredMedicalRecordDataByDay } from "@/src/hooks/pages/patient_detail/useOrdoredMedicalRecordDataByDay";
import { FadeInCardX } from "@/components/custom/motion";
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
import { FlatList } from "react-native";
>>>>>>> main
import { InitPatientRootSecure } from "./InitPatient";
import {
  DailyMedicalRecordDataComponent,
  AddDataToMedicalRecordModal,
<<<<<<< HEAD
  AnthropometricMeasurementTrendsChart,
} from "./PatientDetailMedicalRecord";
import { PatientDetailMedicalRecordSession } from "./PatientDetailMedicalRecord";
import { ScrollView } from "react-native";
import { SessionEmpty } from "../../home/shared/SessionEmpty";
import { router } from "expo-router";
import { usePatientDetail } from "@/src/context/pages";
=======
} from "./PatientDetailMedicalRecord";
>>>>>>> main

export interface PatientDetailMedicalRecordProps {}

const PatientDetailMedicalRecordComponent: React.FC<
  PatientDetailMedicalRecordProps
> = ({}) => {
<<<<<<< HEAD
  const { patient } = usePatientDetail();
  const [showAddDataModal, setShowAddDataModal] = useState<boolean>(false);
  const { data, error, onLoading } = useMedicalRecord();
  const ordoredMedicalRecordData = useOrdoredMedicalRecordDataByDay(data);
  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: MedicalRecordDataOrdoredByDay[number];
      index: number;
    }) => (
      <FadeInCardX delayNumber={index} key={index}>
        <DailyMedicalRecordDataComponent
        
          data={item}
          key={index}
        />
      </FadeInCardX>
    ),
    []
  );
  if (onLoading) return <Loading />;

  return (
    <React.Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-v-16"
      >
        <VStack className="flex-1 bg-background-primary">
          <PatientDetailMedicalRecordSession title="Graphique d'évolution du poids">
            <AnthropometricMeasurementTrendsChart
              range={{
                start:
                  ordoredMedicalRecordData[ordoredMedicalRecordData.length - 1]
                    ?.recordDate,
                end: ordoredMedicalRecordData[0]?.recordDate,
              }}
              gap={0}
            />
          </PatientDetailMedicalRecordSession>
          <PatientDetailMedicalRecordSession
            title="Mesures récentes"
            actionName="voir plus"
            onActionPress={() => {
              router.navigate(`/(screens)/${patient.id}/monitoring`);
            }}
          >
            <VStack className="gap-3">
              {ordoredMedicalRecordData.length === 0 ? (
                <SessionEmpty
                  iconName="SearchSlash"
                  message="Aucun enregistrement de données médicales trouvés."
                />
              ) : (
                ordoredMedicalRecordData
                  .slice(0, 3)
                  .map((item, index) => renderItem({ item, index }))
              )}
            </VStack>
          </PatientDetailMedicalRecordSession>

          <AddDataToMedicalRecordModal
            isVisible={showAddDataModal}
            onClose={() => {
              setShowAddDataModal(false);
            }}
          />
        </VStack>
      </ScrollView>
=======
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
          <FadeInCardX delayNumber={index} key={item.recordDate.toDateString()}>
            <DailyMedicalRecordDataComponent
              onUpdate={() => {
                setReloadMedicalRecord(prev => prev + 1);
              }}
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
>>>>>>> main
      {!showAddDataModal && (
        <Fab
          className="bg-primary-c_light"
          onPress={() => setShowAddDataModal(true)}
        >
          <FabIcon as={Plus} className="h-5 w-5 text-white" />
        </Fab>
      )}
<<<<<<< HEAD
    </React.Fragment>
=======
      <AddDataToMedicalRecordModal
        isVisible={showAddDataModal}
        onClose={() => {
          setShowAddDataModal(false);
          setReloadMedicalRecord(prev => prev + 1);
        }}
      />
    </VStack>
>>>>>>> main
  );
};

export const PatientDetailMedicalRecord = () => {
  return (
    <InitPatientRootSecure>
      <PatientDetailMedicalRecordComponent />
    </InitPatientRootSecure>
  );
};
