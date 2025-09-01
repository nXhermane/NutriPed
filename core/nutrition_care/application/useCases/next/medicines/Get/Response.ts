import { Either, ExceptionBase, Result } from "@/core/shared";
import { MedicineDto } from "../../../../dtos/next/medicines/MedicineDto";

export type GetMedicineResponse = Either<
  ExceptionBase,
  Result<MedicineDto[]>
>;
