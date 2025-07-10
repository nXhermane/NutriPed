import { Either, ExceptionBase, Result } from "@shared";
import { GrowthReferenceTableDto } from "../../../../dtos";

export type DeleteGrowthReferenceTableResponse = Either<
  ExceptionBase | unknown,
  Result<GrowthReferenceTableDto>
>;
