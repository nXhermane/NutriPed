import { MedicalRecord } from "../../domain";
import { AggregateID, ApplicationMapper } from "@shared";
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
      dataFieldResponse: entity.getDataFields().map(valObj => ({
        code: valObj.code.unpack(),
        recordedAt: valObj.recodedAt.unpack(),
        type: valObj.type,
        value: valObj.value,
        unit: valObj.unit?.unpack(),
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
