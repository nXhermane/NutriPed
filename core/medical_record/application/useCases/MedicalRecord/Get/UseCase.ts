import { ApplicationMapper, handleError, left, Result, right, UseCase } from "@shared";
import { GetMedicalRecordRequest } from "./Request";
import { GetMedicalRecordResponse } from "./Response";
import { MedicalRecord, MedicalRecordRepository } from "@core/medical_record/domain";
import { MedicalRecordDto } from "@core/medical_record/application/dtos";

export class GetMedicalRecordUseCase implements UseCase<GetMedicalRecordRequest, GetMedicalRecordResponse> {
   constructor(private readonly repo: MedicalRecordRepository, private readonly mapper: ApplicationMapper<MedicalRecord, MedicalRecordDto>) {}
   async execute(request: GetMedicalRecordRequest): Promise<GetMedicalRecordResponse> {
      try {
         const medical_record = await this.repo.getByPatientIdOrID(request.patientOrMedicalRecordId);
         return right(Result.ok(this.mapper.toResponse(medical_record)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
