import { PatientDiagnosticData } from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { PatientDiagnosticDataPersistenceDto } from "../dtos";

export class PatientDiagnosticDataInfraMapper
  implements
    InfrastructureMapper<
      PatientDiagnosticData,
      PatientDiagnosticDataPersistenceDto
    >
{
  toPersistence(
    entity: PatientDiagnosticData
  ): PatientDiagnosticDataPersistenceDto {
    const { clinicalSigns } = entity.getClinicalSigns().unpack();
    return {
      id: entity.id as string,
      sex: entity.sex,
      birthday: entity.getBirthDay().unpack(),
      anthropMeasures: entity
        .getAnthropometricData()
        .unpack()
        .entry.map(anthroEntry => ({
          code: anthroEntry.code.unpack(),
          unit: anthroEntry.unit.unpack(),
          value: anthroEntry.value,
        })),
      biologicalTestResults: entity
        .getBiologicalTestResults()
        .map(biologicalResult => {
          const { code, unit, value } = biologicalResult.unpack();
          return {
            code: code.unpack(),
            unit: unit.unpack(),
            value,
          };
        }),
      clinicalSigns: {
        clinicalSigns: clinicalSigns.map(clinicalData => ({
          code: clinicalData.unpack().code.unpack(),
          data: clinicalData.unpack().data,
        })),
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: PatientDiagnosticDataPersistenceDto): PatientDiagnosticData {
    const patientDiagnosticDataRes = PatientDiagnosticData.create(
      {
        ...record,
        anthropometricData: { anthropometricMeasures: record.anthropMeasures },
      },
      record.id
    );
    if (patientDiagnosticDataRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(
          patientDiagnosticDataRes,
          PatientDiagnosticDataInfraMapper.name
        )
      );

    const { id, updatedAt, createdAt, ...props } =
      patientDiagnosticDataRes.val.getProps();
    return new PatientDiagnosticData({
      id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props,
    });
  }
}
