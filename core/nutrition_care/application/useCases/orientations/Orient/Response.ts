import { Either, ExceptionBase, Result } from "@shared";
export type OrientationResultDto = {
  name: string;
  code: string;
};
export type OrientResponse = Either<
  ExceptionBase | unknown,
  Result<OrientationResultDto>
>;
