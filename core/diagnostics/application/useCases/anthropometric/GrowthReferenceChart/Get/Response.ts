import { Either, ExceptionBase, Result } from "@shared";
import { GrowthReferenceChartDto } from "../../../../dtos";

export type GetGrowthReferenceChartResponse = Either<ExceptionBase | unknown, Result<GrowthReferenceChartDto[]>>;
