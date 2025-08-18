import { Result } from "@shared";
import {
  PatientDiagnosticData,
  NutritionalAssessmentResult,
} from "../../../models";
import { EvaluationContext } from "../../../../common";
import { AnthropometricData } from "../../../../anthropometry";
import { ClinicalData } from "../../../../clinical";
import { BiologicalTestResult } from "../../../../biological";

export interface INutritionalAssessmentService {
  evaluateNutritionalStatus(
    context: EvaluationContext,
    anthropometric: AnthropometricData,
    clinical: ClinicalData,
    biological: BiologicalTestResult[]
  ): Promise<Result<NutritionalAssessmentResult>>;
}
