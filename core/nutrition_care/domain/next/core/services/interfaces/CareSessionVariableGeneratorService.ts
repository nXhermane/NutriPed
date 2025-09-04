import { AggregateID, Result } from "@/core/shared";
import { CarePhase, DailyCareRecord } from "../../models";

export interface ICareSessionVariableGeneratorService {
  generate(
    patientId: AggregateID,
    currentCarePhase: CarePhase,
    currentDailyRecord: DailyCareRecord
  ): Promise<Result<Record<string, number | string>>>;
}
