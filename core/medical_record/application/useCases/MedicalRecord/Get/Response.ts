import { MedicalRecordDto } from "./../../../dtos";
import { Either, ExceptionBase, Result } from "@shared";

export type GetMedicalRecordResponse = Either<ExceptionBase | unknown, Result<MedicalRecordDto>>;
