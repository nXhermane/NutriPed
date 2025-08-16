import { VStack } from "@/components/ui/vstack";
import React, { useCallback, useState } from "react";
import {
  medicalRecordKeys,
  useMedicalRecord,
  useOrdoredMedicalRecordDataByDay,
} from "@/src/hooks";
import { Loading } from "@/components/custom";
import { FadeInCardX } from "@/components/custom/motion";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Plus } from "lucide-react-native";
import { ScrollView } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { usePatientDetail } from "@/src/context/pages";
import { SessionEmpty } from "../../home/shared/SessionEmpty";
import { InitPatientRootSecure } from "./InitPatient";
import {
  DailyMedicalRecordDataComponent,
  AddDataToMedicalRecordModal,
  AnthropometricMeasurementTrendsChart,
  PatientDetailMedicalRecordSession,
} from "./PatientDetailMedicalRecord";
import { MedicalRecordDataOrdoredByDay } from "@/src/hooks/pages/patient_detail/useOrdoredMedicalRecordDataByDay";
import { useQueryClient } from "@tanstack/react-query";

export interface PatientDetailMedicalRecordProps {}

const PatientDetailMedicalRecordComponent: React.FC<
  PatientDetailMedicalRecordProps
> = ({}) => {
  const { patient } = usePatientDetail();
  const queryClient = useQueryClient();
  const [showAddDataModal, setShowAddDataModal] = useState<boolean>(false);

  // The hook now follows react-query's standard return values
  const { data, isLoading } = useMedicalRecord();
  const ordoredMedicalRecordData = useOrdoredMedicalRecordDataByDay(data);

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: MedicalRecordDataOrdoredByDay[number];
      index: number;
    }) => (
      <FadeInCardX delayNumber={index} key={item.recordDate.toDateString()}>
        {/* The onUpdate prop is no longer needed */}
        <DailyMedicalRecordDataComponent data={item} />
      </FadeInCardX>
    ),
    []
  );

  // Use isLoading from react-query
  if (isLoading) return <Loading />;

  return (
    <React.Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-v-16"
      >
        <VStack className="flex-1 bg-background-primary">
          <PatientDetailMedicalRecordSession title="Graphique d'évolution du poids">
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
            <FlashList
              data={ordoredMedicalRecordData.slice(0, 3)}
              renderItem={renderItem}
              keyExtractor={(item) => item.recordDate.toDateString()}
              scrollEnabled={false}
              estimatedItemSize={100}
              ListEmptyComponent={() => (
                <SessionEmpty
                  iconName="SearchSlash"
                  message="Aucun enregistrement de données médicales trouvé."
                />
              )}
            />
          </PatientDetailMedicalRecordSession>
        </VStack>
      </ScrollView>

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
          // Invalidate the query to refetch data automatically
          queryClient.invalidateQueries({
            queryKey: medicalRecordKeys.detail(patient.id),
          });
        }}
      />
    </React.Fragment>
  );
};

export const PatientDetailMedicalRecord = () => {
  return (
    <InitPatientRootSecure>
      <PatientDetailMedicalRecordComponent />
    </InitPatientRootSecure>
  );
};
