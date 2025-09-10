import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";
import { AppetiteTestResultDto } from "../../../appetite_test";

export type GetAllPatientAppetiteTestResultResponse = Either<
  ExceptionBase | unknown,
  Result<(AppetiteTestResultDto & { id: AggregateID })[]>
>;
