import {
  BirthDateField,
  BirthDateToTodayZodSchema,
  SexField,
} from "./sharedAnthropometricDataForm";

export const InitialBiogicalInterpretationFormFields = [
  BirthDateField,
  SexField,
];

export const InitialBiogicalInterpretationFormZodSchema = [
  BirthDateToTodayZodSchema,
  SexField,
];
