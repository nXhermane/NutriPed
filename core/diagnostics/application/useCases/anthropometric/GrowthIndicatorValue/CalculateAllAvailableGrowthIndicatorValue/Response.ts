import { GrowthIndicatorValueDto } from "@/core/diagnostics/application/dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type CalculateAllAvailableGrowthIndicatorValueResponse = Either<
  ExceptionBase | unknown,
  Result<GrowthIndicatorValueDto[]>
>;
