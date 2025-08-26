import { FieldDataType } from "@/core/constants";

export enum DataFieldCategory {
  OBSERVATION = "observation_data_field",
  VITAL_SIGN = "vital_sign_data_field",
  QUESTION = "question_data_field",
  DATA_POINTS = "data_points_data_field",
}
export interface DataFieldReference {
  code: string;
  label: string;
  question: string;
  category: DataFieldCategory;
  type: FieldDataType;
  dataRange?: [number, number];
  enumValue?: { label: string; value: string }[];
  units?: { default: string; available: string[] };
  defaultValue: any;
}
