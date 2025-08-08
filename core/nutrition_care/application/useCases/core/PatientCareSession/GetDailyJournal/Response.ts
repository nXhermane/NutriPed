import { DailyCareJournalDto } from "./../../../../dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type GetDailyJouranlResponse = Either<
  ExceptionBase | unknown,
  Result<{
    current?: DailyCareJournalDto;
    previeous: DailyCareJournalDto[];
  }>
>;
