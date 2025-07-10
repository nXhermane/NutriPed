import { Either, ExceptionBase, Result } from "@shared";
import { GrowthReferenceTableDto } from "../../../../dtos";

export type GetGrowthReferenceTableResponse = Either<
  ExceptionBase | unknown,
  Result<GrowthReferenceTableDto[]>
>;
