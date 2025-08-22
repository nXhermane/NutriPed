import {
  AnthropometricRecord,
  AppetiteTestRecord,
  BiologicalValueRecord,
  ClinicalSingDataRecord,
  ComplicationDataRecord,
  DataFieldResponse,
  MedicalRecord,
} from "@core/medical_record";
import {
  InfrastructureMapper,
  Result,
  InfraMapToDomainError,
  formatError,
} from "@shared";
import { MedicalRecordPersistenceDto } from "../dtos";

export class MedicalRecordInfraMapper
  implements InfrastructureMapper<MedicalRecord, MedicalRecordPersistenceDto> {
  toPersistence(entity: MedicalRecord): MedicalRecordPersistenceDto {
    const {
      anthropometricData,
      biologicalData,
      clinicalData,
      complicationData,
    } = entity.getProps();
    return {
      id: entity.id as string,
      patientId: entity.getPatientId(),
      anthropometricData: anthropometricData.map(anthrop => ({
        code: anthrop.getCode(),
        id: anthrop.id,
        context: anthrop.getContext(),
        recordedAt: anthrop.getRecordDate(),
        ...anthrop.getMeasurement(),
      })),
      biologicalData: biologicalData.map(test => ({
        code: test.getCode(),
        id: test.id,
        recordedAt: test.getRecordAt(),
        ...test.getMeasurement(),
      })),
      clinicalData: clinicalData.map(sign => ({
        code: sign.getCode(),
        id: sign.id,
        data: sign.getData(),
        isPresent: sign.getIsPresent(),
        recordedAt: sign.getRecordAt(),
      })),
      complications: complicationData.map(complication => ({
        code: complication.getCode(),
        id: complication.id,
        isPresent: complication.getIsPresent(),
        recordedAt: complication.getRecordAt(),
      })),
      dataFieldsResponse: entity.getDataFields().map(field => ({
        code: field.code.unpack(),
        id: field.id,
        data: field.data,
        recordAt: field.recordAt.unpack()
      })),
      appetiteTests: entity.getAppetiteTest().map(test => ({
        id: test.id,
        amount: test.amount,
        productType: test.productType,
        fieldResponses: test.fieldResponses,
        recordAt: test.recordAt.unpack()
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: MedicalRecordPersistenceDto): MedicalRecord {
    // Convert anthropometric data
    const anthropometricDataResults = record.anthropometricData.map(anthrop =>
      AnthropometricRecord.create({ ...anthrop }, anthrop.id)
    );

    // Convert biological data
    const biologicalDataResults = record.biologicalData.map(test =>
      BiologicalValueRecord.create({ ...test }, test.id)
    );

    // Convert clinical data
    const clinicalDataResults = record.clinicalData.map(sign =>
      ClinicalSingDataRecord.create({ ...sign }, sign.id)
    );

    // Convert complications
    const complicationResults = record.complications.map(complication =>
      ComplicationDataRecord.create({ ...complication }, complication.id)
    );

    // Convert dataFields
    const dataFieldsResults = record.dataFieldsResponse.map(field =>
      DataFieldResponse.create(field, field.id)
    );

    // Convert Appetite Tests
    const appetiteTestResults = record.appetiteTests.map(test => AppetiteTestRecord.create(test, test.id))

    // Combine all results
    const combinedRes = Result.combine([
      ...anthropometricDataResults,
      ...biologicalDataResults,
      ...clinicalDataResults,
      ...complicationResults,
      ...dataFieldsResults,
      ...appetiteTestResults
    ]);

    if (combinedRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(combinedRes, MedicalRecordInfraMapper.name)
      );
    }

    return new MedicalRecord({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        patientId: record.patientId,
        anthropometricData: anthropometricDataResults.map(r => r.val),
        biologicalData: biologicalDataResults.map(r => r.val),
        clinicalData: clinicalDataResults.map(r => r.val),
        complications: complicationResults.map(r => r.val),
        complicationData: complicationResults.map(r => r.val),
        dataFieldsResponse: dataFieldsResults.map(r => r.val),
        appetiteTests: appetiteTestResults.map(r => r.val)
      },
    });
  }
}
