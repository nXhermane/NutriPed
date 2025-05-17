import { AggregateID } from "@shared";

export type GetMedicineRequest = {
   medicineId?: AggregateID;
   medicineCode?: string;
};
