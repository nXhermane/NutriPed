import { Either, ExceptionBase, Result } from "@/core/shared";
import { OnGoingTreatmentDto } from "@/core/nutrition_care/application/dtos";

export type GetOnGoingTreatmentResponse = Either<
  ExceptionBase | unknown,
  Result<OnGoingTreatmentDto>
>;
