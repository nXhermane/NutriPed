import { Either, ExceptionBase, Result } from "@shared";
import { PatientDto } from "../../../dtos";

export type GetPatientResponse = Either<ExceptionBase | unknown, Result<PatientDto[]>>;
