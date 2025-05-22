import { Either, ExceptionBase, Result } from "@shared";
import { MedicineDosageResultDto } from "../../../dtos";

export type GetMedicineDosageResponse = Either<
  ExceptionBase | unknown,
  Result<MedicineDosageResultDto>
>;
