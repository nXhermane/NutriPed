import { CreatePropsDto } from "@shared";
import { MedicineDto } from "../../../dtos";

export type CreateMedicineRequest = CreatePropsDto<MedicineDto>;
