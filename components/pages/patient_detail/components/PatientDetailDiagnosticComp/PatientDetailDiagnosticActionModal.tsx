import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import { useUI } from "@/src/context";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import colors from "tailwindcss/colors";
import { PatientDetailDiagnosticAction } from "./PatientDetailDiagnosticAction";

export interface PatientDetailDiagnosticActionModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export const PatientDetailDiagnosticActionModal: React.FC<
  PatientDetailDiagnosticActionModalProps
> = ({ isVisible = false, onClose = () => void 0 }) => {
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
    <BottomSheetModal
      onDismiss={() => {
        onClose();
      }}
      snapPoints={["27%"]}
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
      <PatientDetailDiagnosticAction />
    </BottomSheetModal>
  );
};
