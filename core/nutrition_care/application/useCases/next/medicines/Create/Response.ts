import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type CreateMedicineResponse = Either<
  ExceptionBase,
  Result<{ id: AggregateID }>
>;
