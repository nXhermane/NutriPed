import { DynamicFormGenerator } from "@/components/custom";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import {
  SuggestMilkFormSchema,
  SuggestMilkFormZodSchema,
} from "@/src/constants/ui";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  PatientMeasurementForm,
  PatientMeasurementFormProps,
} from "../../chart_detail";

export interface SuggestMilkFormProps extends PatientMeasurementFormProps {}

export const SuggestMilkForm: React.FC<SuggestMilkFormProps> = props => {
  return <PatientMeasurementForm {...props} />;
};
