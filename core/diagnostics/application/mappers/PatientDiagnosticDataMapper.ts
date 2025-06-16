import { ApplicationMapper } from "@shared";
import {
  AnthropEntry,
  ClinicalSign,
  PatientDiagnosticData,
} from "../../domain";
import { ClinicalSignDto, PatientDiagnosticDataDto } from "../dtos";

export class PatientDiagnosticDataMapper
  implements ApplicationMapper<PatientDiagnosticData, PatientDiagnosticDataDto>
{
  toResponse(entity: PatientDiagnosticData): PatientDiagnosticDataDto {
    return {
      id: entity.id,
      sex: entity.getGender().sex,
      birthday: entity.getBirthDay().toString(),
      anthropometricData: {
        data: entity
          .getAnthropometricData()
          .unpack().entry
          .map((val: AnthropEntry) => ({
            code: val.code.unpack(),
            unit: val.unit.unpack(),
            value: val.value,
          })),
      },
      biologicalTestResults: entity
        .getBiologicalTestResults()
        .map(biologicalTestResult => ({
          code: biologicalTestResult.unpack().code.unpack(),
          unit: biologicalTestResult.unpack().unit.unpack(),
          value: biologicalTestResult.unpack().value,
        })),
      clinicalData: {
        clinicalSigns: entity
          .getClinicalSigns()
          .unpack()
          .clinicalSigns.map(this.mapClinicalSign),
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private mapClinicalSign<T>(
    clinicalSign: ClinicalSign<T>
  ): ClinicalSignDto<T> {
    return {
      code: clinicalSign.unpack().code.unpack(),
      data: clinicalSign.unpack().data,
    };
  }
}
