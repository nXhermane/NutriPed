import { Either, ExceptionBase, Result } from "@shared";
import { OrientationReferenceDto } from "../../../../dtos/next/orientation";

export type GetOrientationReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<OrientationReferenceDto[]>
>;
