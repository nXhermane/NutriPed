import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { InitPatientRootSecure } from "./InitPatient";
import { useNutritionalDiagnostic } from "@/src/hooks";
import { Loading } from "@/components/custom";
import {
  InitPatientDiagnosticRoot,
  GlobalDiagnosticSession,
  DiagnosticElements,
  NutritionalDiagnosticNotes,
  PatientDetailDiagnosticActionModal,
} from "./PatientDetailDiagnosticComp";
import { ScrollView } from "react-native";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ChevronUp } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { HumanDateFormatter } from "@/utils";

export interface PatientDetailDiagnosticProps {}

const PatientDetailDiagnosticComponent: React.FC<
  PatientDetailDiagnosticProps
> = ({}) => {
  const [showAddDataModal, setShowAddDataModal] = useState<boolean>(false);
  const { data, error, onLoading } = useNutritionalDiagnostic();

  if (!data || onLoading) return <Loading />;

  return (
    <React.Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-v-14"
      >
        <VStack className="flex-1 bg-background-primary">
          {data.result && (
            <HStack className="items-center justify-between bg-background-secondary px-4 pb-2 pt-4">
              <Text className="font-body text-sm font-normal text-typography-primary">
                {"Date de génération :"}
              </Text>
              <Text className="font-body text-xs">
                {HumanDateFormatter.toRelativeDate(
                  data.result.updatedAt,
                  false
                )}
              </Text>
            </HStack>
          )}
          <GlobalDiagnosticSession nutritionalDiagnosticDto={data} />
          <DiagnosticElements nutDiagnosticDto={data} />
          <NutritionalDiagnosticNotes notes={data.notes} />
        </VStack>
      </ScrollView>
      {!showAddDataModal && (
        <Fab
          className="bg-primary-c_light"
          onPress={() => setShowAddDataModal(true)}
        >
          <FabIcon as={ChevronUp} className="text-white" />
        </Fab>
      )}
      <PatientDetailDiagnosticActionModal
        isVisible={showAddDataModal}
        onClose={() => {
          setShowAddDataModal(false);
        }}
      />
    </React.Fragment>
  );
};

export const PatientDetailDiagnostic: React.FC<
  PatientDetailDiagnosticProps
> = props => {
  return (
    <InitPatientRootSecure>
      <InitPatientDiagnosticRoot>
        <PatientDetailDiagnosticComponent {...props} />
      </InitPatientDiagnosticRoot>
    </InitPatientRootSecure>
  );
};
