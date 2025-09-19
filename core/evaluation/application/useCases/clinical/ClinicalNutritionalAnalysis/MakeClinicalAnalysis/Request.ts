import { AnthroSystemCodes } from "../../../../../domain";
import { Sex } from "@/core/shared";

export type MakeClinicalAnalysisRequest = {
  clinicalSigns: { code: string; data: object }[];
  [AnthroSystemCodes.SEX]: Sex;
  [AnthroSystemCodes.AGE_IN_DAY]: number;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
};
