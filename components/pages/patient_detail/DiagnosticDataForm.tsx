import React, { useRef, useEffect, useCallback } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Check, X } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import {
  DiagnosticDataFormSchema,
  DiagnosticDataFormZodSchema,
} from "@/src/constants/ui";
import type { AggregateID } from "@/core/shared";
import { VStack } from "@/components/ui/vstack";
import { useDiagnosticDataForm } from "@/src/hooks";

export interface DiagnosticDataFormProps {
  patientId: AggregateID;
  isOpen?: boolean;
  onClose?: () => void;
}
export const DiagnosticDataForm: React.FC<DiagnosticDataFormProps> = React.memo(
  ({ patientId, isOpen = false, onClose = () => {} }) => {
    const dynamicFormRef =
      useRef<FormHandler<typeof DiagnosticDataFormSchema>>(null);
    const { isSubmitting, error, success, handleSubmit } =
      useDiagnosticDataForm(patientId, onClose);

    const onFormSubmit = useCallback(async () => {
      const formData = await dynamicFormRef.current?.submit();
      handleSubmit(formData as any);
    }, [dynamicFormRef, handleSubmit]);

    useEffect(() => {
      if (!isOpen) {
        dynamicFormRef.current?.reset();
      }
    }, [isOpen]);

    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="border-0 bg-background-secondary px-0">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="h-v-1 w-5 rounded-sm" />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="h-[85vh] w-full">
            <HStack className="w-full items-center justify-between px-4 py-v-3">
              <Heading className="font-h2 text-lg font-semibold text-typography-primary">
                Donnée de diagnostic
              </Heading>
              <Button
                className={`h-v-6 rounded-lg bg-primary-c_light px-4 ${error ? "bg-red-500" : ""}`}
                onPress={onFormSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting && <ButtonSpinner />}
                {!isSubmitting && error && (
                  <Icon as={X} className="text-white" />
                )}
                {!isSubmitting && success && (
                  <Icon as={Check} className="text-white" />
                )}
                <ButtonText className="font-body text-xs text-white">
                  Enregistrer
                </ButtonText>
              </Button>
            </HStack>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <DynamicFormGenerator
                schema={DiagnosticDataFormSchema}
                zodSchema={DiagnosticDataFormZodSchema as any}
                ref={dynamicFormRef}
              />
            </KeyboardAwareScrollView>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    );
  }
);
