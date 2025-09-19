import { FadeInCardY } from "@/components/custom/motion";
import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import { BiologicalAnalysisInterpretationDto } from "@/core/evaluation";
import { useUI } from "@/src/context";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React from "react";
import colors from "tailwindcss/colors";
import { BiologicalInterpretationResults } from "./BiologicalInterpretationResults";

export interface BiologicalInterpretationResultModalProps {
  title?: string;
  isVisible: boolean;
  results: BiologicalAnalysisInterpretationDto[];
  onClose: () => void;
}

export const BiologicalInterpretationResultModal: React.FC<
  BiologicalInterpretationResultModalProps
> = ({ isVisible, onClose, results, title }) => {
  const { colorMode } = useUI();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

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
              <BiologicalInterpretationResults results={results} />
            </FadeInCardY>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
