import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreatePatientRequest,
  DeletePatientRequest,
  GetPatientRequest,
  UpdatePatientRequest,
} from "../../useCases";
import { PatientDto } from "../../dtos";

export interface IPatientService {
  create(
    req: CreatePatientRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetPatientRequest
  ): Promise<AppServiceResponse<PatientDto[]> | Message>;
  update(
    req: UpdatePatientRequest
  ): Promise<AppServiceResponse<boolean> | Message>;
  delete(
    req: DeletePatientRequest
  ): Promise<AppServiceResponse<boolean> | Message>;
}
