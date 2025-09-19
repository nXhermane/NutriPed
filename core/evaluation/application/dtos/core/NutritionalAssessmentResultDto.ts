import { AggregateID } from "@shared";
import { GrowthIndicatorValueDto } from "../anthropometric";
import { BiologicalAnalysisInterpretationDto } from "../biological";
import { GlobalDiagnosticDto } from "./GlobalDiagnosticDto";
import { ClinicalNutritionalAnalysisResultDto } from "../clinical";

export interface NutritionalAssessmentResultDto {
  id: AggregateID;
  growthIndicatorValues: GrowthIndicatorValueDto[];
  clinicalAnalysis: ClinicalNutritionalAnalysisResultDto[];
  biologicalInterpretation: BiologicalAnalysisInterpretationDto[];
  globalDiagnostics: GlobalDiagnosticDto[];
  createdAt: string;
  updatedAt: string;
}
