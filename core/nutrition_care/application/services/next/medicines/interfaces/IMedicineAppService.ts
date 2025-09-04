import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateMedicineRequest,
  GetMedicineRequest,
  GetMedicineDosageRequest,
} from "../../../../useCases/next/medicines";
import {
  MedicineDto,
  MedicationDosageResultDto,
} from "../../../../../dtos/next/medicines";

export interface IMedicineAppService {
  create(
    req: CreateMedicineRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetMedicineRequest
  ): Promise<AppServiceResponse<MedicineDto[]> | Message>;
  getDosage(
    req: GetMedicineDosageRequest
  ): Promise<AppServiceResponse<MedicationDosageResultDto> | Message>;
}
