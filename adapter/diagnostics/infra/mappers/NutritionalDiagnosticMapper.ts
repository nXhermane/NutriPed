import { DiagnosticModification, NutritionalAssessmentResult, NutritionalDiagnostic, PatientDiagnosticData } from "@core/diagnostics";
import { DomainDate, formatError, InfraMapToDomainError, InfrastructureMapper } from "@shared";
import {
   NutritionalAssessmentResultPersistenceDto,
   NutritionalDiagnosticPersistenceDto,
   PatientDiagnosticDataPersistenceDto,
} from "../dtos";

export class NutritionalDiagnosticInfraMapper implements InfrastructureMapper<NutritionalDiagnostic, NutritionalDiagnosticPersistenceDto> {
   constructor(
      private readonly patientDiagMapper: InfrastructureMapper<PatientDiagnosticData, PatientDiagnosticDataPersistenceDto>,
      private readonly nutriAssessmentMapper: InfrastructureMapper<NutritionalAssessmentResult, NutritionalAssessmentResultPersistenceDto>,
   ) {}
   toPersistence(entity: NutritionalDiagnostic): NutritionalDiagnosticPersistenceDto {
      const { atInit, createdAt, updatedAt, ...record } = entity.getProps();
      return {
         id: record.id as string,
         atInit,
         createdAt,
         updatedAt,
         date: record.date.unpack(),
         notes: record.notes,
         patientId: record.patientId as string,
         result: record.result ? this.nutriAssessmentMapper.toPersistence(record.result) : undefined,
         patientData: this.patientDiagMapper.toPersistence(record.patientData),
         modificationHistories: record.modificationHistories.map((modifHis) => {
            const { date, nextResult, prevResult, reason } = modifHis.unpack();
            return {
               date: date.unpack(),
               nextResult: this.nutriAssessmentMapper.toPersistence(nextResult),
               prevResult: this.nutriAssessmentMapper.toPersistence(prevResult),
               reason,
            };
         }),
      };
   }
   toDomain(record: NutritionalDiagnosticPersistenceDto): NutritionalDiagnostic {
      try {
         const nutritionalDiagnostic = new NutritionalDiagnostic({
            id: record.id,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            props: {
               atInit: record.atInit,
               date: new DomainDate(record.date),
               notes: record.notes,
               patientData: this.patientDiagMapper.toDomain(record.patientData),
               result: record.result ? this.nutriAssessmentMapper.toDomain(record.result) : undefined,
               patientId: record.patientId,
               modificationHistories: record.modificationHistories.map((modifHis) => {
                  return new DiagnosticModification({
                     date: new DomainDate(modifHis.date),
                     nextResult: this.nutriAssessmentMapper.toDomain(modifHis.nextResult),
                     prevResult: this.nutriAssessmentMapper.toDomain(modifHis.prevResult),
                     reason: modifHis.reason,
                  });
               }),
            },
         });
         return nutritionalDiagnostic;
      } catch (e: unknown) {
         throw new InfraMapToDomainError(formatError(e as never, NutritionalDiagnosticInfraMapper.name));
      }
   }
}
