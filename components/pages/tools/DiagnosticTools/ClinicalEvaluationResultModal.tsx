import { FadeInCardY } from "@/components/custom/motion";
import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import { ClinicalNutritionalAnalysisResultDto } from "@/core/evaluation";
import { useUI } from "@/src/context";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import colors from "tailwindcss/colors";
import { ClinicalEvaluationResult } from "./ClinicalEvaluationResult";

export interface ClinicalEvaluationResultModalProps {
  title?: string;
  isVisible: boolean;
  results: ClinicalNutritionalAnalysisResultDto[];
  onClose: () => void;
}

export const ClinicalEvaluationResultModal: React.FC<
  ClinicalEvaluationResultModalProps
> = ({ isVisible, onClose, results }) => {
  const { colorMode } = useUI();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        onDismiss={() => onClose()}
        snapPoints={["60%"]}
        ref={bottomSheetModalRef}
        handleIndicatorStyle={{
          backgroundColor:
            colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
        }}
        handleComponent={props => <BottomSheetDragIndicator {...props} />}
        backgroundComponent={props => {
          return (
            <VStack {...props} className="rounded-2xl bg-background-primary" />
          );
        }}
        enablePanDownToClose={true}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {results && (
            <FadeInCardY delayNumber={3}>
              <ClinicalEvaluationResult results={results} />
            </FadeInCardY>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
