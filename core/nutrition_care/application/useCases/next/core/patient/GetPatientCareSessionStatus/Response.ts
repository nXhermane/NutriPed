import { AggregateID, Either, ExceptionBase, Result } from "@shared";
import { NextCore } from "@/core/nutrition_care/domain";
export type GetPatientCareSessionStatusResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    completionStatus: NextCore.DailyCareRecordStatus | undefined;
    pendingItems: { id: AggregateID; type: "action" | "task" }[];
    nextActions: NextCore.OrchestratorOperation[];
  }>
>;
