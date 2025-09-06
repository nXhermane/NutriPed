import { handleError, Result } from "@/core/shared";
import { DailyCareRecord } from "../models";
import { DailyCarePlan, IDailyPlanApplicatorService } from "./interfaces";

export class DailyPlanApplicatorService implements IDailyPlanApplicatorService {

    applyPlan(plan: DailyCarePlan, targetDailyRecord: DailyCareRecord): Result<void> {
       try {
           // Apply all actions from the plan to the target daily record
           // DailyCareRecord.addAction() already handles duplicate prevention
           for (const action of plan.actions) {
               targetDailyRecord.addAction(action);
           }

           // Apply all tasks from the plan to the target daily record
           // DailyCareRecord.addTask() already handles duplicate prevention
           for (const task of plan.tasks) {
               targetDailyRecord.addTask(task);
           }

           return Result.ok<void>(undefined);
       } catch (e) {
        return handleError(e);
       }
    }

}
