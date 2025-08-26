import { MedicalRecord } from "../../domain";
import { ApplicationMapper } from "@shared";
import { MedicalRecordDto } from "../dtos";

export class MedicalRecordMapper
  implements ApplicationMapper<MedicalRecord, MedicalRecordDto>
{
  toResponse(entity: MedicalRecord): MedicalRecordDto {
    const {
      anthropometricData,
      biologicalData,
      clinicalData,
      complicationData,
    } = entity.getProps();
    return {
      id: entity.id,
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
      complicationData: complicationData.map(complication => ({
        code: complication.getCode(),
        id: complication.id,
        isPresent: complication.getIsPresent(),
        recordedAt: complication.getRecordAt(),
      })),
      dataFieldResponse: entity.getDataFields().map(field => ({
        code: field.code.unpack(),
        data: field.data,
        id: field.id,
        recordedAt: field.recordAt.unpack(),
      })),
      appetiteTests: entity.getAppetiteTest().map(test => ({
        amount: test.amount,
        id: test.id,
        productType: test.productType,
        fieldResponses: test.fieldResponses,
        recordedAt: test.recordAt.unpack(),
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
