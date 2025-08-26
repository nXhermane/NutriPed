import {
  AclAppetiteTestData,
  MedicalRecordACL,
  PatientData,
} from "../evaluation";
import { IMedicalRecordService } from "../medical_record";
import { Result } from "../shared/core";
import { AggregateID, DomainDate } from "../shared/domain";
import { handleError } from "../shared/exceptions";

export class MedicalRecordACLImpl implements MedicalRecordACL {
  constructor(private readonly medicalRecordService: IMedicalRecordService) {}

  async getPatientData(data: {
    patientId: AggregateID;
  }): Promise<Result<PatientData>> {
    try {
      const result = await this.medicalRecordService.get({
        patientOrMedicalRecordId: data.patientId,
      });
      if ("content" in result) {
        const _errorContent = JSON.parse(result.content);
        return Result.fail(_errorContent);
      }
      const medicalRecord = result.data;
      const anthropometricData = this.getLastValues(
        medicalRecord.anthropometricData
      ).map(({ id, recordedAt, context, ...props }) => props);
      const clinicalData = this.getLastValues(medicalRecord.clinicalData).map(
        ({ id, recordedAt, ...props }) => props
      );
      const biologicalData = this.getLastValues(
        medicalRecord.biologicalData
      ).map(({ id, recordedAt, ...props }) => props);
      const dataFields = this.getLastValues(
        medicalRecord.dataFieldResponse
      ).map(({ id, recordedAt, ...props }) => props);
      return Result.ok({
        anthroData: anthropometricData,
        biologicalData: biologicalData,
        clinicalData: clinicalData,
        dataFieldData: dataFields,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  async getAllAppetiteTestData(data: {
    patientId: AggregateID;
  }): Promise<Result<AclAppetiteTestData[]>> {
    try {
      const result = await this.medicalRecordService.get({
        patientOrMedicalRecordId: data.patientId,
      });
      if ("content" in result) {
        const _errorContent = JSON.parse(result.content);
        return Result.fail(_errorContent);
      }
      const medicalRecord = result.data;
      const appetiteTestData = medicalRecord.appetiteTests;
      return Result.ok(
        appetiteTestData.sort(
          (a, b) =>
            new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
        )
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  async getPatientDataBefore(data: {
    patientId: AggregateID;
    date: DomainDate;
  }): Promise<Result<PatientData>> {
    try {
      const result = await this.medicalRecordService.get({
        patientOrMedicalRecordId: data.patientId,
      });
      if ("content" in result) {
        const _errorContent = JSON.parse(result.content);
        return Result.fail(_errorContent);
      }
      const medicalRecord = result.data;
      const anthropometricData = this.getLastValues(
        this.getAllValueBefore(medicalRecord.anthropometricData, data.date)
      ).map(({ id, recordedAt, context, ...props }) => props);
      const clinicalData = this.getLastValues(
        this.getAllValueBefore(medicalRecord.clinicalData, data.date)
      ).map(({ id, recordedAt, ...props }) => props);
      const biologicalData = this.getLastValues(
        this.getAllValueBefore(medicalRecord.biologicalData, data.date)
      ).map(({ id, recordedAt, ...props }) => props);
      const dataFields = this.getLastValues(
        this.getAllValueBefore(medicalRecord.dataFieldResponse, data.date)
      ).map(({ id, recordedAt, ...props }) => props);
      return Result.ok({
        anthroData: anthropometricData,
        biologicalData: biologicalData,
        clinicalData: clinicalData,
        dataFieldData: dataFields,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private getLastValues<T extends { code: string; recordedAt: string }>(
    array: T[]
  ): T[] {
    return Object.values(
      array.reduce((acc: { [code: string]: T }, current) => {
        const key = current.code;
        if (
          !acc[key] ||
          new Date(acc[key].recordedAt).getTime() <=
            new Date(current.recordedAt).getTime()
        )
          acc[current.code] = current;
        return acc;
      }, {})
    );
  }
  private getAllValueBefore<T extends { code: string; recordedAt: string }>(
    array: T[],
    date: DomainDate
  ): T[] {
    return array.filter(
      value => new Date(value.recordedAt).getTime() < date.getDate().getTime()
    );
  }
}
