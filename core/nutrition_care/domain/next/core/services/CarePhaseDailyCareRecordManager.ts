import {
  AggregateID,
  DomainDateTime,
  formatError,
  GenerateUniqueId,
  handleError,
  Result,
} from "@/core/shared";
import { CarePhase, DailyCareRecord } from "../models";
import {
  ICarePhaseDailyCareRecordManager,
  IDailyPlanGeneratorService,
  IDailyPlanApplicatorService,
  ICareSessionVariableGeneratorService,
} from "./interfaces";

export class CarePhaseDailyCareRecordManager
  implements ICarePhaseDailyCareRecordManager
{
  constructor(
    private readonly dailyPlanGenerator: IDailyPlanGeneratorService,
    private readonly dailyPlanApplicator: IDailyPlanApplicatorService,
    private readonly careSessionVariableGenerator: ICareSessionVariableGeneratorService
  ) {}

  async generateDailyCareRecord(
    carePhase: CarePhase,
    patientId: AggregateID,
    targetDate: DomainDateTime,
    context?: Record<string, number>
  ): Promise<Result<DailyCareRecord>> {
    try {
      // If no context provided, generate it from the care session
      let patientContext = context;
      if (!patientContext) {
        const contextResult =
          await this.careSessionVariableGenerator.generateActionGenerationContextVariables(
            patientId,
            carePhase,
            targetDate
          );
        if (contextResult.isFailure) {
          return Result.fail(
            formatError(contextResult, CarePhaseDailyCareRecordManager.name)
          );
        }
        patientContext = contextResult.val as Record<string, number>;
      }

      // Generate the daily care record using the plan generator
      const generationResult = await this.dailyPlanGenerator.generate(
        carePhase,
        patientContext,
        targetDate
      );

      if (generationResult.isFailure) {
        return Result.fail(
          formatError(generationResult, CarePhaseDailyCareRecordManager.name)
        );
      }

      return Result.ok(generationResult.val);
    } catch (e) {
      return handleError(e);
    }
  }

  async updateExistingDailyCareRecord(
    carePhase: CarePhase,
    existingRecord: DailyCareRecord,
    patientId: AggregateID,
    context?: Record<string, number>
  ): Promise<Result<DailyCareRecord>> {
    try {
      // If no context provided, generate it from the care session
      let patientContext = context;
      if (!patientContext) {
        const contextResult =
          await this.careSessionVariableGenerator.generateActionGenerationContextVariables(
            patientId,
            carePhase,
            existingRecord.getProps().date
          );
        if (contextResult.isFailure) {
          return Result.fail(
            formatError(contextResult, CarePhaseDailyCareRecordManager.name)
          );
        }
        patientContext = contextResult.val as Record<string, number>;
      }

      // Generate a new plan based on current care phase state
      const planGenerationResult = await this.dailyPlanGenerator.generate(
        carePhase,
        patientContext,
        existingRecord.getProps().date
      );

      if (planGenerationResult.isFailure) {
        return Result.fail(
          formatError(
            planGenerationResult,
            CarePhaseDailyCareRecordManager.name
          )
        );
      }

      const newPlan = {
        actions: planGenerationResult.val.getProps().treatmentActions,
        tasks: planGenerationResult.val.getProps().monitoringTasks,
      };

      // Apply the new plan to the existing record
      const applicationResult = this.dailyPlanApplicator.applyPlan(
        newPlan,
        existingRecord
      );

      if (applicationResult.isFailure) {
        return Result.fail(
          formatError(applicationResult, CarePhaseDailyCareRecordManager.name)
        );
      }

      return Result.ok(existingRecord);
    } catch (e) {
      return handleError(e);
    }
  }
}
