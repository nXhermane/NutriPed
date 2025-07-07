import {
  AnthroSystemCodes,
  CreateAnthropometricData,
} from "@/core/diagnostics";
import { Sex } from "@/core/shared";

export type CalculateAllAvailableGrowthIndicatorValueRequest = {
  anthropometricData: CreateAnthropometricData;
  [AnthroSystemCodes.SEX]: Sex;
  [AnthroSystemCodes.AGE_IN_DAY]: number;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
};
