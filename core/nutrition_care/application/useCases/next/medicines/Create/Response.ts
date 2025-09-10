import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateMedicineResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
