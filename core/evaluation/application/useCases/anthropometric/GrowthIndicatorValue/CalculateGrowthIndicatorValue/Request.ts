import { Sex } from "@/core/shared";
import {
  AnthroSystemCodes,
  CreateAnthropometricData,
} from "../../../../../domain";

export type CalculateGrowthIndicatorValueRequest = {
  indicatorCode: string;
  anthropometricData: CreateAnthropometricData;
  sex: Sex;
  [AnthroSystemCodes.AGE_IN_DAY]: number;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
};
