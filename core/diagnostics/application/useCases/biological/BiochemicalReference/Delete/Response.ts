import { Either, ExceptionBase, Result } from "@shared";
import { BiochemicalReferenceDto } from "../../../../dtos";

export type DeleteBiochemicalReferenceResponse = Either<ExceptionBase | unknown, Result<BiochemicalReferenceDto>>;
