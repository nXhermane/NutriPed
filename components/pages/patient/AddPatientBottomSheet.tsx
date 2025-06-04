import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React, { useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import { AddPatientFormSchema } from "@/src/constants/ui";
export interface AddPatientBottomSheetProps {
  isOpen?: boolean;
  onClose?: () => void;
}
export const AddPatientBottomSheet: React.FC<AddPatientBottomSheetProps> = ({
  isOpen,
  onClose = () => void 0,
}) => {
  const dynamicFormRef = useRef<FormHandler<any>>(null);
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />

      <ActionsheetContent className={"border-0 bg-background-secondary px-0"}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator className={"h-v-1 w-5 rounded-sm"} />
        </ActionsheetDragIndicatorWrapper>
        <VStack className={"h-[85vh] w-full"}>
          <HStack className={"w-full items-center justify-between px-4 py-v-3"}>
            <Heading className={"font-h2 text-2xl text-typography-primary"}>
              Nouveau Patient
            </Heading>
            <Pressable
              className={"rounded-lg bg-primary-c_light px-4 py-[4px]"}
              onPress={() => {
                dynamicFormRef.current?.submit().then((value: any) => {
                  console.log(value);
                });
              }}
            >
              <Text className={"font-body text-xs"}>Ajouter</Text>
            </Pressable>
          </HStack>
          {/* <ActionsheetScrollView > */}
          <KeyboardAwareScrollView>
            <DynamicFormGenerator
              ref={dynamicFormRef}
              schema={AddPatientFormSchema}
            />
          </KeyboardAwareScrollView>
          {/* </ActionsheetScrollView> */}
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
