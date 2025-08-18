import { BiologicalTestResultDto } from "../../../../dtos";
import {
  AnthroSystemCodes,
  CreateAnthropometricData,
  EvaluationContext,
} from "../../../../../domain";
import { Sex } from "@shared";

export type MakeIndependantDiagnosticRequest = {
  anthropometric: CreateAnthropometricData;
  context: {
    [AnthroSystemCodes.SEX]: Sex;
    [AnthroSystemCodes.AGE_IN_DAY]: number;
    [AnthroSystemCodes.AGE_IN_MONTH]: number;
  };
  clinical: { code: string; data: object }[];
  biological: BiologicalTestResultDto[];
};
