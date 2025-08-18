import { ClinicalNutritionalAnalysisResultDto } from "../../../../dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type MakeClinicalAnalysisResponse = Either<
  ExceptionBase | unknown,
  Result<ClinicalNutritionalAnalysisResultDto[]>
>;
