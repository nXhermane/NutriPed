import { Either, ExceptionBase, Result } from "@shared";
import { ClinicalSignReferenceDto } from "../../../../dtos";

export type UpdateClinicalSignReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<ClinicalSignReferenceDto>
>;
