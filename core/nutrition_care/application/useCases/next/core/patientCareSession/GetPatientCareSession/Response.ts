import { Either, ExceptionBase, Result } from "@/core/shared";
import { PatientCareSessionAggregateDto } from "@/core/nutrition_care/application/dtos";

export type GetPatientCareSessionResponse = Either<
  ExceptionBase | unknown,
  Result<PatientCareSessionAggregateDto>
>;
