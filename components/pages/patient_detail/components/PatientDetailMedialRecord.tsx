import { VStack } from "@/components/ui/vstack";
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
import { InitPatientRootSecure } from "./InitPatient";
import {
  DailyMedicalRecordDataComponent,
  AddDataToMedicalRecordModal,
  AnthropometricMeasurementTrendsChart,
  PatientDetailMedicalRecordSession,
} from "./PatientDetailMedicalRecord";
import { ScrollView } from "react-native";
import { SessionEmpty } from "../../home/shared/SessionEmpty";
import { router } from "expo-router";
import { usePatientDetail } from "@/src/context/pages";

export interface PatientDetailMedicalRecordProps {}

const PatientDetailMedicalRecordComponent: React.FC<
  PatientDetailMedicalRecordProps
> = ({}) => {
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
        <DailyMedicalRecordDataComponent data={item} key={index} />
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
      {!showAddDataModal && (
        <Fab
          className="bg-primary-c_light"
          onPress={() => setShowAddDataModal(true)}
        >
          <FabIcon as={Plus} className="h-5 w-5 text-white" />
        </Fab>
      )}
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
