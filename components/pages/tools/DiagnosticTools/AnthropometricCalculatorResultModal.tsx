import { FadeInCardY } from "@/components/custom/motion";
import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import { GrowthIndicatorValueDto } from "@/core/diagnostics";
import { useUI } from "@/src/context";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React from "react";
import { useRef } from "react";
import colors from "tailwindcss/colors";
import { AnthropometricCalculatorResult } from "./AnthropometricCalculatorResult";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Save } from "lucide-react-native";

interface AnthropometricCalculatorResultModalProps {
  title?: string;
  isVisible: boolean;
  results: GrowthIndicatorValueDto[] | null;
  onClose: () => void;
  onSave?: () => void;
}

export const AnthropometricCalculatorResultModal: React.FC<
  AnthropometricCalculatorResultModalProps
> = ({ isVisible, results, onClose, onSave, title }) => {
  const { colorMode } = useUI();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isVisible])

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        onDismiss={onClose}
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
              <AnthropometricCalculatorResult title={title} results={results} />
            </FadeInCardY>
          )}
        </BottomSheetScrollView>

        {onSave && (
          <Button
            className="absolute right-4 top-3 rounded-full bg-primary-c_light p-3"
            onPress={onSave}
          >
            <ButtonIcon as={Save} className="text-typography-primary" />
          </Button>
        )}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
