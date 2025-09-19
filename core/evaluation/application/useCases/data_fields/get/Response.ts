import { Either, ExceptionBase, Result } from "@/core/shared";
import { DataFieldReferenceDto } from "../../../dtos";

export type GetDataFieldRefResponse = Either<
  ExceptionBase | unknown,
  Result<DataFieldReferenceDto[]>
>;
