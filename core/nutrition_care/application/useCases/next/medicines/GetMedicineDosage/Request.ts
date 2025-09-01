import { MEDICINE_CODES } from "@/core/constants";
import { MedicationDosageContext } from "../../../../../domain/modules/next/medicines/models";

export interface GetMedicineDosageRequest {
  code: MEDICINE_CODES;
  context: MedicationDosageContext;
}
