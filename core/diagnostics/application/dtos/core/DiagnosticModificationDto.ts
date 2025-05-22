import { NutritionalAssessmentResultDto } from "./NutritionalAssessmentResultDto";

export interface DiagnosticModificationDto {
  prevResult: NutritionalAssessmentResultDto;
  nextResult: NutritionalAssessmentResultDto;
  date: string;
  reason: string;
}
