import { BiochemicalRangeStatus } from "../../../domain";

export interface BiologicalAnalysisInterpretationDto {
   code: string;
   interpretation: string[];
   status: BiochemicalRangeStatus;
}
