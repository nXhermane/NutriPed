import { Either, ExceptionBase, Result } from "@shared";
import { BiochemicalReferenceDto } from "../../../../dtos";

export type GetBiochemicalReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<BiochemicalReferenceDto[]>
>;
