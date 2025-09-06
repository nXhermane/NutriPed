import { AggregateID } from "@shared";

export type GenerateDailyCarePlanRequest = {
  sessionId: AggregateID;
  targetDate?: string;
};
