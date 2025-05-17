import { Result } from "@shared";
import { EvaluationContext } from "../../../../common";
import { BiologicalAnalysisInterpretation, BiologicalTestResult } from "../../../models";

export interface IBiologicalInterpretationService {
   interpret(data: BiologicalTestResult[], context: EvaluationContext): Promise<Result<BiologicalAnalysisInterpretation[]>>;
}
