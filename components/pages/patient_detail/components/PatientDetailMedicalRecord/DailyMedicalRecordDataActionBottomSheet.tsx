import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import { MedicalRecordDto } from "@/core/medical_record";
import { useUI } from "@/src/context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import colors from "tailwindcss/colors";
import { DailyMedicalRecordDataAction } from "./DailyMedicalRecordDataAction";
import { DailyMedicalRecordDataActionModalContext } from "../../context";
export type MedicalRecordDataType =
  | {
      tag: "anthropometric";
      data: MedicalRecordDto["anthropometricData"][number];
    }
  | {
      tag: "biological";
      data: MedicalRecordDto["biologicalData"][number];
    }
  | {
      tag: "clinical";
      data: MedicalRecordDto["clinicalData"][number];
    }
  | {
      tag: "complication";
      data: MedicalRecordDto["complicationData"][number];
    };
export interface DailyMedicalRecordDataActionModalProps {
  onClose?: () => void;
  isVisible?: boolean;
  data: MedicalRecordDataType;
}

export const DailyMedicalRecordDataActionModal: React.FC<
  DailyMedicalRecordDataActionModalProps
> = ({ isVisible = false, onClose = () => {}, data }) => {
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
    <BottomSheetModal
      onDismiss={() => onClose && onClose()}
      snapPoints={["60%"]}
      ref={bottomSheetModalRef}
      handleIndicatorStyle={{
        backgroundColor:
          colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
      }}
      handleComponent={props => <BottomSheetDragIndicator {...props} />}
      backgroundComponent={props => {
        return (
          <VStack {...props} className="rounded-2xl bg-background-secondary" />
        );
      }}
      enablePanDownToClose={true}
    >
      <DailyMedicalRecordDataActionModalContext.Provider
        value={{ close: onClose }}
      >
        <DailyMedicalRecordDataAction data={data} />
      </DailyMedicalRecordDataActionModalContext.Provider>
    </BottomSheetModal>
  );
};
