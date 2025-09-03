import { Either, ExceptionBase, Result } from "@shared";
import { OrientationReferenceDto } from "../../../../dtos/next/orientation";

export type UpdateOrientationReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<OrientationReferenceDto>
>;
