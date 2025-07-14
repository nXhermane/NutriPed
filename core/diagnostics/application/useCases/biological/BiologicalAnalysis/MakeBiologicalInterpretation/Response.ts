import { BiologicalAnalysisInterpretationDto } from "./../../../../dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type MakeBiologicalInterpretationResponse = Either<ExceptionBase | unknown, Result<BiologicalAnalysisInterpretationDto[]>>