import { Result } from "@shared";
import { PatientDiagnosticData, NutritionalAssessmentResult } from "../../../models";

export interface INutritionalAssessmentService {
    evaluateNutritionalStatus(
        patientData: PatientDiagnosticData
    ): Promise<Result<NutritionalAssessmentResult>>;
}