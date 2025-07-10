import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateMedicineRequest,
  GetMedicineRequest,
  GetMedicineDosageRequest,
} from "../../useCases";
import { MedicineDto, MedicineDosageResultDto } from "../../dtos";

export interface IMedicineAppService {
  create(
    req: CreateMedicineRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetMedicineRequest
  ): Promise<AppServiceResponse<MedicineDto[]> | Message>;
  getDosage(
    req: GetMedicineDosageRequest
  ): Promise<AppServiceResponse<MedicineDosageResultDto> | Message>;
}
