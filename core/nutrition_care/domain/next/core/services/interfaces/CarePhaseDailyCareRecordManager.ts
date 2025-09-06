import { AggregateID, DomainDateTime, Result } from "@/core/shared";
import { CarePhase, DailyCareRecord } from "../../models";

export interface ICarePhaseDailyCareRecordManager {
  generateDailyCareRecord(
    carePhase: CarePhase,
    patientId: AggregateID,
    targetDate: DomainDateTime,
    context?: Record<string, number>
  ): Promise<Result<DailyCareRecord>>;

  updateExistingDailyCareRecord(
    carePhase: CarePhase,
    existingRecord: DailyCareRecord,
    patientId: AggregateID,
    context?: Record<string, number>
  ): Promise<Result<DailyCareRecord>>;
}
