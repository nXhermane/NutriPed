import { AnthroSystemCodes, MEDICINE_CODES } from "@/core/constants";
import { SystemCode, Result } from "@/core/shared";
import { MedicationDosageResult } from "../../models";

export interface MedicationDosageContext {
  [AnthroSystemCodes.WEIGHT]: number;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
}

export interface IMedicationDosageCalculator {
  calculate(
    medicineCode: SystemCode<MEDICINE_CODES>,
    context: MedicationDosageContext
  ): Promise<Result<MedicationDosageResult>>;
}
