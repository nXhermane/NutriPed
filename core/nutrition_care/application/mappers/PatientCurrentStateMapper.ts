import { ApplicationMapper } from "@shared";
import { PatientCurrentState, ValueType } from "../../domain";
import { PatientCurrentStateDto, ValueTypeDto } from "../dtos";

export class PatientCurrentStateMapper implements ApplicationMapper<PatientCurrentState, PatientCurrentStateDto> {
   toResponse(entity: PatientCurrentState): PatientCurrentStateDto {
      const { anthropometricData, clinicalSignData, biologicalData, appetiteTestResult, complicationData } =
         entity.getProps();
      return {
         id: entity.id,
         complicationData: Object.fromEntries(Object.values(complicationData).map((value) => [value.code, this.mapToValueTypeDto(value)])),
         biologicalData: Object.fromEntries(Object.values(biologicalData).map((value) => [value.code, this.mapToValueTypeDto(value)])),
         anthropometricData: Object.fromEntries(Object.values(anthropometricData).map((value) => [value.code, this.mapToValueTypeDto(value)])),
         appetiteTestResult: Object.fromEntries(Object.values(appetiteTestResult).map((value) => [value.code, this.mapToValueTypeDto(value)])),
         clinicalSignData: Object.fromEntries(Object.values(clinicalSignData).map((value) => [value.code, this.mapToValueTypeDto(value)])),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   private mapToValueTypeDto<T>(valueType: ValueType<T>): ValueTypeDto<T> {
      return {
         code: valueType.code,
         date: valueType.date.unpack(),
         value: valueType.value,
      };
   }
}
