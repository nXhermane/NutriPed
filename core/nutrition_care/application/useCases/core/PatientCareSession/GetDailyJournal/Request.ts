import { AggregateID } from "@/core/shared";

export type GetDailyJournalRequest = {
  patientIdOrSessionId: AggregateID;
};
