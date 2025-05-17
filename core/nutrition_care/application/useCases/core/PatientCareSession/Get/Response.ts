import { Either, ExceptionBase, Result } from "@shared";
import { PatientCareSessionDto } from "../../../../dtos";

export type GetPatientCareSessionResponse = Either<ExceptionBase | unknown, Result<PatientCareSessionDto>>;
