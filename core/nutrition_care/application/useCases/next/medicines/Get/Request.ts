import { MEDICINE_CODES } from "@/core/constants";
import { AggregateID } from "@/core/shared";

export type GetMedicineRequest = {
  code?: MEDICINE_CODES;
  id?: AggregateID;
};
