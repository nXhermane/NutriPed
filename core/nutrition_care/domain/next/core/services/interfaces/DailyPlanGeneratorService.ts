import { AggregateID, DomainDateTime, Result } from "@/core/shared";
import { CarePhase, DailyCareRecord } from "../../models";

export interface IDailyPlanGeneratorService {
  generate(
    carePhase: CarePhase,
    context: Record<string, number>,
    date: DomainDateTime
  ): Promise<Result<DailyCareRecord>>;
}
