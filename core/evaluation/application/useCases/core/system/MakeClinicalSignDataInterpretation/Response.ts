import { Either, ExceptionBase, Result } from "@/core/shared";
export type MakeClinicalSignDataInterpretationResponse = Either<
  ExceptionBase | unknown,
  Result<{ code: string; isPresent: boolean }[]>
>;
