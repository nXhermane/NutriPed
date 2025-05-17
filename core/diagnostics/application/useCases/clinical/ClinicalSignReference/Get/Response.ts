import { Either, ExceptionBase, Result } from "@shared";
import { ClinicalSignReferenceDto } from "../../../../dtos";

export type GetClinicalSignReferenceResponse = Either<ExceptionBase | unknown, Result<ClinicalSignReferenceDto[]>>;
