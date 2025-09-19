import {
  DynamicFormGenerator,
  FormHandler,
  Loading,
} from "@/components/custom";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import React, { Ref } from "react";
import { MeasurementFormSchema } from "@/src/hooks";
import { icons } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export interface PatientMeasurementFormProps {
  schema?: MeasurementFormSchema;
  onSubmit: () => void;
  formRef: Ref<FormHandler<any>>;
  submitBtnLabel: string;
  submitBtnRightIcon: keyof typeof icons;
  title?: string;
}
export const PatientMeasurementForm: React.FC<PatientMeasurementFormProps> = ({
  formRef,
  onSubmit,
  schema,
  submitBtnLabel,
  submitBtnRightIcon,
  title = "Données du patient",
}) => {
  const LucideIcon = icons[submitBtnRightIcon];
  return (
    <VStack className="m-4 gap-4 rounded-xl bg-background-secondary px-3 py-3">
      <HStack className="items-center justify-between">
        <Heading className="font-h4 text-base font-medium text-typography-primary">
          {title}
        </Heading>
      </HStack>
      <KeyboardAwareScrollView>
        {!schema ? (
          <Loading />
        ) : (
          <DynamicFormGenerator
            schema={[{ fields: schema?.fields || [], section: "" }]}
            zodSchema={schema?.zodSchema}
            ref={formRef}
            className="p-0 px-0"
          />
        )}
      </KeyboardAwareScrollView>
      <Button
        className="h-v-10 rounded-xl bg-primary-c_light"
        onPress={onSubmit}
      >
        <ButtonIcon as={LucideIcon} className="text-white" />
        <ButtonText className="font-h4 font-medium text-white">
          {submitBtnLabel}
        </ButtonText>
      </Button>
    </VStack>
  );
};
