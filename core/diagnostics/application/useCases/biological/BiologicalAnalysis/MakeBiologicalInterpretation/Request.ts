import { Sex } from "@/core/shared";
import { AnthroSystemCodes } from "./../../../../../domain";
import { BiologicalTestResultDto } from "./../../../../dtos";

export type MakeBiologicalInterpretationRequest = {
  biologicalTestResults: BiologicalTestResultDto[];
  [AnthroSystemCodes.SEX]: Sex;
  [AnthroSystemCodes.AGE_IN_DAY]: number;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
};
