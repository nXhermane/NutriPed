import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import {
  AddAnthropometricMeasureToMedicalRecordFormSchema,
  AddAnthropometricMeasureToMedicalRecordFormZodSchema,
} from "@/src/constants/ui";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import React from "react";

export interface AddAnthropometricDataToMedicalRecordFormProps {
  formRef: React.Ref<FormHandler<any>>;
}

export const AddAnthropometricDataToMedicalRecordForm: React.FC<
  AddAnthropometricDataToMedicalRecordFormProps
> = ({ formRef }) => {
  return (
    <KeyboardAwareScrollView
      ScrollViewComponent={BottomSheetScrollView as any}
      showsVerticalScrollIndicator={false}
    >
      <VStack className="px-7">
        <Heading className="font-h4 text-lg font-medium text-typography-primary">
          Données anthropométriques
        </Heading>
        <Text className="font-body text-xs text-typography-primary_light">
          Remplissez les champs correspondant aux données que vous souhaitez
          ajouter.
        </Text>
      </VStack>
      <DynamicFormGenerator
        ref={formRef}
        schema={AddAnthropometricMeasureToMedicalRecordFormSchema}
        zodSchema={AddAnthropometricMeasureToMedicalRecordFormZodSchema}
        className="mx-4 bg-background-primary"
      />
    </KeyboardAwareScrollView>
  );
};
