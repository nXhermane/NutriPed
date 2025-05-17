import { Result } from "@shared";
import { BiochemicalRangeStatus, BiologicalAnalysisInterpretation } from "../../../models";
export type RangeStatusLiteral = `${BiochemicalRangeStatus}`;
export type BiologicalVariableObject = { [key: string]: RangeStatusLiteral };
export interface IBiologicalVariableGeneratorService {
   generate(interpretation: BiologicalAnalysisInterpretation[]): Promise<Result<BiologicalVariableObject>>;
}
