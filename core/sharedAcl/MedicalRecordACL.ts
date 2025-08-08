import { MedicalRecordACL, PatientData } from "../diagnostics";
import { IMedicalRecordService } from "../medical_record";
import { Result } from "../shared/core";
import { AggregateID } from "../shared/domain";
import { handleError } from "../shared/exceptions";

export class MedicalRecordACLImpl implements MedicalRecordACL {
    constructor(private readonly medicalRecordService: IMedicalRecordService) { }
    async getPatientData(data: { patientId: AggregateID; }): Promise<Result<PatientData>> {
        try {
            const result = await this.medicalRecordService.get({ patientOrMedicalRecordId: data.patientId })
            if ('content' in result) {
                const _errorContent = JSON.parse(result.content)
                return Result.fail(_errorContent)
            }
            const medicalRecord = result.data
            const anthropometricData = this.getLastValues(medicalRecord.anthropometricData).map(({ id, recordedAt, context, ...props }) => props)
            const clinicalData = this.getLastValues(medicalRecord.clinicalData).map(({ id, recordedAt, ...props }) => props)
            const biologicalData = this.getLastValues(medicalRecord.biologicalData).map(({ id, recordedAt, ...props }) => props)
            return Result.ok({
                anthroData: anthropometricData,
                biologicalData: biologicalData,
                clinicalData: clinicalData
            })
        } catch (e: unknown) {
            return handleError(e)
        }
    }
    private getLastValues<T extends { code: string, recordedAt: string }>(array: T[]): T[] {
        return Object.values(array.reduce((acc: { [code: string]: T }, current) => {
            const key = current.code
            // FIXME: voir si on pourrai améliorer les recordat pour prendre en compte le time afin de connaitre directement la derniere valeur au lieu d'introduit  <= au lieu de <  
            if (!acc[key] || new Date(acc[key].recordedAt).getTime() <= new Date(current.recordedAt).getTime()) acc[current.code] = current
            return acc
        }, {}))
    }

}