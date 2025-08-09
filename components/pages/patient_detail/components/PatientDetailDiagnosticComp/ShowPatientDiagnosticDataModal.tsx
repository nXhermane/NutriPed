import { Loading } from "@/components/custom";
import { FadeInCardX } from "@/components/custom/motion";
import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUI } from "@/src/context";
import { usePatientDetail } from "@/src/context/pages";
import { useNutritionalDiagnostic } from "@/src/hooks";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import colors from "tailwindcss/colors";
import {
  AnthropometricItemComponent,
  BiologicalItemComponent,
  ClinicalItemComponent,
} from "../PatientDetailMedicalRecord";

export interface ShowPatientDiagnosticDataModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}
export const ShowPatientDiagnosticDataModal: React.FC<
  ShowPatientDiagnosticDataModalProps
> = ({ isVisible = false, onClose = () => void 0 }) => {
  const { patient } = usePatientDetail();
  const { data, error, onLoading } = useNutritionalDiagnostic();
  const { colorMode } = useUI();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isVisible]);

  if (onLoading) return <Loading />;
  return (
    <BottomSheetModal
      onDismiss={() => {
        onClose();
      }}
      snapPoints={["50%"]}
      ref={bottomSheetModalRef}
      handleIndicatorStyle={{
        backgroundColor:
          colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
      }}
      handleComponent={props => <BottomSheetDragIndicator {...props} />}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
      backgroundComponent={props => {
        return (
          <VStack {...props} className="rounded-2xl bg-background-primary" />
        );
      }}
      enablePanDownToClose={true}
    >
      <BottomSheetScrollView>
        <VStack className="h-v-64 py-v-5">
          <VStack className="gap-4 px-4">
            {/* <HStack className="w-full justify-center">
              <Text className="text-center font-h4 font-medium text-typography-primary">
                Informations générales
              </Text>
            </HStack> */}
            <HStack className="items-center justify-between pb-v-2">
              <Text className="font-body text-sm font-normal text-typography-primary">
                Sexe: {data?.patientData.sex}
              </Text>
              <Text className="font-body text-sm font-normal text-typography-primary">
                Date de naissance: {data?.patientData.birthday}
              </Text>
            </HStack>
          </VStack>
          <VStack className="gap-4 px-4">
            <HStack className="w-full justify-center">
              <Text className="text-center font-h4 font-medium text-typography-primary">
                Anthropometrie
              </Text>
            </HStack>
            <VStack className="rounded-xl">
              {data?.patientData.anthropometricData.data.map((item, index) => (
                <FadeInCardX key={item.code} delayNumber={index * 2}>
                  <AnthropometricItemComponent data={item} />
                </FadeInCardX>
              ))}
            </VStack>
          </VStack>
          {data?.patientData.biologicalTestResults.length != 0 && (
            <VStack className="gap-4 px-4">
              <HStack className="w-full justify-center">
                <Text className="text-center font-h4 font-medium text-typography-primary">
                  Biologique
                </Text>
              </HStack>
              <VStack className="rounded-xl">
                {data?.patientData.biologicalTestResults.map((item, index) => (
                  <FadeInCardX key={item.code} delayNumber={index * 2}>
                    <BiologicalItemComponent data={item} />
                  </FadeInCardX>
                ))}
              </VStack>
            </VStack>
          )}
          {data?.patientData.clinicalData.clinicalSigns.length != 0 && (
            <VStack className="gap-4 px-4">
              <HStack className="w-full justify-center">
                <Text className="text-center font-h4 font-medium text-typography-primary">
                  Signes Cliniques
                </Text>
              </HStack>
              <VStack className="rounded-xl">
                {data?.patientData.clinicalData.clinicalSigns.map(
                  (item, index) => (
                    <FadeInCardX key={item.code} delayNumber={index * 2}>
                      <ClinicalItemComponent
                        data={{ ...item, isPresent: undefined }}
                      />
                    </FadeInCardX>
                  )
                )}
              </VStack>
            </VStack>
          )}
        </VStack>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
