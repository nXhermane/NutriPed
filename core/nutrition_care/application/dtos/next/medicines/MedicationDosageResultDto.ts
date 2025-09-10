import {
  Amount,
  IDosageRange,
} from "../../../../domain/modules/next/medicines/models/valueObjects";

export interface MedicationDosageResultDto {
  dailyDosage: Amount;
  dailyFrequency: number;
  dosage: IDosageRange;
}
