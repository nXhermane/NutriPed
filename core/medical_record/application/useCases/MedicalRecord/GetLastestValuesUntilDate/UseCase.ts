import { AggregateID, DomainDateTime, handleError, left, Result, UseCase } from "@/core/shared";
import { GetLatestValuesUntilDateRequest } from "./Request";
import { GetLatestValuesUntilDateResponse } from "./Response";
import { INormalizeAnthropometricDataACL, MedicalRecord, MedicalRecordRepository } from "@/core/medical_record/domain";

export class GetLatestValuesUntilDateUseCase implements UseCase<GetLatestValuesUntilDateRequest, GetLatestValuesUntilDateResponse> {
    constructor(
        private readonly medicalRecordRepo: MedicalRecordRepository,
        private readonly normalizeAnthropDataACL: INormalizeAnthropometricDataACL
    ) { }
    async execute(request: GetLatestValuesUntilDateRequest): Promise<GetLatestValuesUntilDateResponse> {
        try {
            const dateRes = DomainDateTime.create(request.datetime);
            if (dateRes.isFailure) {
                return left(dateRes);
            }
            const medicalRecord = await this.getMedicalRecord(request.patientOrMedicalRecordId);
            const medicalRecordUntilDateRes = this.getAllLatestValuesUntilDate(medicalRecord, dateRes.val);

        } catch (e: unknown) {
            return left(handleError(e));
        }
    }

    private async getMedicalRecord(id: AggregateID): Promise<MedicalRecord> {
        return this.medicalRecordRepo.getByPatientIdOrID(id);
    }

    private getAllLatestValuesUntilDate(medicalRecord: MedicalRecord, date: DomainDateTime) {
        try {
            return Result.ok({
                anthropometric: medicalRecord.getLatestAnthropometricDataUntilDate(date),
                dataFields: medicalRecord.getLatestDataFieldDataUntilDate(date),
                clinicalData: medicalRecord.getLatestClinicalDataUntilDate(date),
                biological: medicalRecord.getLatestBiologicalDataUntilDate(date),
                complication: medicalRecord.getLatestComplicationDataUntilDate(date)
            })
        } catch (e: unknown) {
            return handleError(e);
        }
    }

    private normalizeNecessaryData() {
        
    }

}