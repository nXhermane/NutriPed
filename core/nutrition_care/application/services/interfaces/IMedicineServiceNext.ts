import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateMedicineRequest,
  GetMedicineRequest,
  GetMedicineDosageRequest,
} from "../../useCases/next/medicines";

export interface IMedicineServiceNext {
  create(
    req: CreateMedicineRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;

  get(
    req: GetMedicineRequest
  ): Promise<AppServiceResponse<any[]> | Message>;

  getDosage(
    req: GetMedicineDosageRequest
  ): Promise<AppServiceResponse<any> | Message>;
}
