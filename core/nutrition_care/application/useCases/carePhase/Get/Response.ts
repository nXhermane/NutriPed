import { CarePhaseDto } from "@/core/nutrition_care/application/dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type GetCarePhaseReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<CarePhaseDto.CarePhaseReferenceDto[]>
>;
