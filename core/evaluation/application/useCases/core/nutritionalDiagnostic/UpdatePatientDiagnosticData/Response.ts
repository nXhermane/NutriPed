import { Either, ExceptionBase, Result } from "@shared";
import { PatientDiagnosticDataDto } from "../../../../dtos";

export type UpdatePatientDiagnosticDataResponse = Either<
  ExceptionBase | unknown,
  Result<PatientDiagnosticDataDto>
>;
