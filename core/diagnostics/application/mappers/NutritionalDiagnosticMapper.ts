import { ApplicationMapper } from "@shared";
import { DiagnosticModification, NutritionalAssessmentResult, NutritionalDiagnostic, PatientDiagnosticData } from "../../domain";
import { DiagnosticModificationDto, NutritionalAssessmentResultDto, NutritionalDiagnosticDto, PatientDiagnosticDataDto } from "../dtos";

export class NutritionalDiagnosticMapper implements ApplicationMapper<NutritionalDiagnostic, NutritionalDiagnosticDto> {
   constructor(
      private readonly patientDataMapper: ApplicationMapper<PatientDiagnosticData, PatientDiagnosticDataDto>,
      private readonly nutritionalAssessmentMapper: ApplicationMapper<NutritionalAssessmentResult, NutritionalAssessmentResultDto>,
   ) {}
   toResponse(entity: NutritionalDiagnostic): NutritionalDiagnosticDto {
      return {
         id: entity.id,
         notes: entity.getNotes(),
         date: entity.getProps().date.unpack(),
         patientData: this.patientDataMapper.toResponse(entity.getPatientData()),
         patientId: entity.getPatientId(),
         modificationHistories: entity.getModificationHistories().map(this.mapDiagnosticModification),
         atInit: entity.getDiagnosticResult() ? false : true,
         result: entity.getDiagnosticResult()
            ? this.nutritionalAssessmentMapper.toResponse(entity.getDiagnosticResult() as NutritionalAssessmentResult)
            : undefined,
         createAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   private mapDiagnosticModification(diagnosticModification: DiagnosticModification): DiagnosticModificationDto {
      const { date, nextResult, prevResult, reason } = diagnosticModification.unpack();
      return {
         date: date.unpack(),
         nextResult: this.nutritionalAssessmentMapper.toResponse(nextResult),
         prevResult: this.nutritionalAssessmentMapper.toResponse(prevResult),
         reason,
      };
   }
}
