import { Either, ExceptionBase, Result } from "@/core/shared";
import { MedicationDosageResultDto } from "../../../../dtos/next/medicines/MedicationDosageResultDto";

export type GetMedicineDosageResponse = Either<
  ExceptionBase,
  Result<MedicationDosageResultDto>
>;
