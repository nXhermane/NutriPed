import { Either, ExceptionBase, Result } from "@shared";
import { GrowthReferenceChartDto } from "../../../../dtos";

export type DeleteGrowthReferenceChartResponse = Either<ExceptionBase | unknown, Result<GrowthReferenceChartDto>>;
