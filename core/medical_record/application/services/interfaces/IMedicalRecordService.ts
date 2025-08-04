import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateMedicalRecordRequest,
  GetMedicalRecordRequest,
  UpdateMedicalRecordRequest,
  DeleteMedicalRecordRequest,
  AddDataToMedicalRecordRequest,
  DeleteDataFromMedicalRecordRequest,
  GetNormalizedAnthropometricDataRequest,
} from "../../useCases";
import { MedicalRecordDto } from "../../dtos";
import { CreateAnthropometricRecord } from "./../../../domain";

export interface IMedicalRecordService {
  create(
    req: CreateMedicalRecordRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetMedicalRecordRequest
  ): Promise<AppServiceResponse<MedicalRecordDto> | Message>;
  update(
    req: UpdateMedicalRecordRequest
  ): Promise<AppServiceResponse<void> | Message>;
  delete(
    req: DeleteMedicalRecordRequest
  ): Promise<AppServiceResponse<void> | Message>;
  addData(
    req: AddDataToMedicalRecordRequest
  ): Promise<AppServiceResponse<void> | Message>;
  deleteData(
    req: DeleteDataFromMedicalRecordRequest
  ): Promise<AppServiceResponse<void> | Message>;
  getNormalizeAnthropometricData(
    req: GetNormalizedAnthropometricDataRequest
  ): Promise<
    | AppServiceResponse<
        (CreateAnthropometricRecord & {
          recordedAt: string;
          id: AggregateID;
        })[]
      >
    | Message
  >;
}
