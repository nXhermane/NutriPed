import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateMedicalRecordRequest,
  GetMedicalRecordRequest,
  UpdateMedicalRecordRequest,
  DeleteMedicalRecordRequest,
  AddDataToMedicalRecordRequest
} from "../../useCases";
import { MedicalRecordDto } from "../../dtos";

export interface IMedicalRecordService {
  create(req: CreateMedicalRecordRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(req: GetMedicalRecordRequest): Promise<AppServiceResponse<MedicalRecordDto> | Message>;
  update(req: UpdateMedicalRecordRequest): Promise<AppServiceResponse<void> | Message>;
  delete(req: DeleteMedicalRecordRequest): Promise<AppServiceResponse<void> | Message>;
  addData(req: AddDataToMedicalRecordRequest): Promise<AppServiceResponse<void> | Message>;
}