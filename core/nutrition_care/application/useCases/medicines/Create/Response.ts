import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CreateMedicineResponse = Either<
  ExceptionBase | unknown,
  Result<{ id: AggregateID }>
>;
