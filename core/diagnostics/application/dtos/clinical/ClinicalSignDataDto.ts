import { ClinicalDataType } from "../../../domain";

export interface ClinicalSignDataDto {
  name: string;
  code: string;
  question: string;
  dataType: ClinicalDataType;
  dataRange?: [number, number];
  required: boolean;
  enumValue?: string[];
}
