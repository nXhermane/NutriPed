import { Either, ExceptionBase, Result } from "@shared";
import { MedicineDto } from "../../../dtos";

export type GetMedicineResponse = Either<ExceptionBase | unknown, Result<MedicineDto[]>>;
