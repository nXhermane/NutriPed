import { Either, ExceptionBase, Result } from "@shared";
import { GrowthReferenceTableDto } from "../../../../dtos";

export type UpdateGrowthReferenceTableResponse = Either<
  ExceptionBase | unknown,
  Result<GrowthReferenceTableDto>
>;
