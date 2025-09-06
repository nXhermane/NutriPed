import { Result } from "@/core/shared";
import { DailyCareAction, DailyCareRecord, DailyMonitoringTask } from "../../models"

export interface DailyCarePlan {
    actions: DailyCareAction[];
    tasks: DailyMonitoringTask[];
}
export interface IDailyPlanApplicatorService {
   applyPlan(plan: DailyCarePlan,targetDailyRecord: DailyCareRecord): Result<void>;
}