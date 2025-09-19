import { Either, ExceptionBase, Result } from "@shared";
import { GrowthReferenceChartDto } from "../../../../dtos";

export type UpdateGrowthReferenceChartResponse = Either<
  ExceptionBase | unknown,
  Result<GrowthReferenceChartDto>
>;
