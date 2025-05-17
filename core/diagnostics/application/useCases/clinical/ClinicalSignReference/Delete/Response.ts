import { Either, ExceptionBase, Result } from "@shared";
import { ClinicalSignReferenceDto } from "../../../../dtos";

export type DeleteClinicalSignReferenceResponse = Either<ExceptionBase | unknown, Result<ClinicalSignReferenceDto>>;
