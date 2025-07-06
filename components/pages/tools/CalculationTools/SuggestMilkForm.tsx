import React from "react";
import {
  PatientMeasurementForm,
  PatientMeasurementFormProps,
} from "../../chart_detail";

export interface SuggestMilkFormProps extends PatientMeasurementFormProps {}

export const SuggestMilkForm: React.FC<SuggestMilkFormProps> = props => {
  return <PatientMeasurementForm {...props} />;
};
