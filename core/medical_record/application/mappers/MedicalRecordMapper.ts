import { MedicalRecord } from "../../domain";
import { ApplicationMapper } from "@shared";
import { MedicalRecordDto } from "../dtos";

export class MedicalRecordMapper implements ApplicationMapper<MedicalRecord, MedicalRecordDto> {
   toResponse(entity: MedicalRecord): MedicalRecordDto {
      return {
         id: entity.id,
         patientId: entity.getPatientId(),
         anthropometricData: entity.getAnthropometricData().map((valObj) => ({
            code: valObj.code.unpack(),
            context: valObj.context,
            recordedAt: valObj.recordedAt.unpack(),
            unit: valObj.unit.unpack(),
            value: valObj.value,
         })),
         biologicalData: entity.getBiologicalData().map((valObj) => ({
            code: valObj.code.unpack(),
            recordedAt: valObj.recordedAt.unpack(),
            unit: valObj.unit.unpack(),
            value: valObj.value,
         })),
         clinicalData: entity.getClinicalData().map((valObj) => ({
            code: valObj.code.unpack(),
            data: valObj.data,
            recordedAt: valObj.recordedAt.unpack(),
         })),
         complicationData: entity.getComplicationData().map((valObj) => ({
            code: valObj.code.unpack(),
            isPresent: valObj.isPresent,
            recordedAt: valObj.recordedAt.unpack(),
         })),
         dataFieldResponse: entity.getDataFields().map((valObj) => ({
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
