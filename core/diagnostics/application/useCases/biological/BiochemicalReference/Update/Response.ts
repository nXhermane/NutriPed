import { Either, ExceptionBase, Result } from "@shared";
import { BiochemicalReferenceDto } from "../../../../dtos";

export type UpdateBiochemicalReferenceResponse = Either<ExceptionBase | unknown, Result<BiochemicalReferenceDto>>;
