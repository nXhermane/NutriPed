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
  IDailyPlanGeneratorService,
  IDailyScheduleService,
  IDailyActionGeneratorService,
  IDailyTaskGeneratorService,
} from "./interfaces";

export class DailyPlanGeneratorService implements IDailyPlanGeneratorService {
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly dailyScheduleService: IDailyScheduleService,
    private readonly dailyActionGenerator: IDailyActionGeneratorService,
    private readonly dailyTaskGenerator: IDailyTaskGeneratorService
  ) {}

  async generate(
    carePhase: CarePhase,
    context: Record<string, number>,
    date: DomainDateTime
  ): Promise<Result<DailyCareRecord>> {
    try {
      // Get the actual entity objects from the care phase
      const treatments = carePhase.getProps().onGoingTreatments;
      const monitoringParameters = carePhase.getProps().monitoringParameters;

      // Get treatments due for the target date
      const treatmentsDueResult =
        this.dailyScheduleService.getTreatmentsDueForDate(treatments, date);
      if (treatmentsDueResult.isFailure) {
        return Result.fail(
          formatError(treatmentsDueResult, DailyPlanGeneratorService.name)
        );
      }

      // Get monitoring parameters due for the target date
      const monitoringDueResult =
        this.dailyScheduleService.getMonitoringParametersDueForDate(
          monitoringParameters,
          date
        );
      if (monitoringDueResult.isFailure) {
        return Result.fail(
          formatError(monitoringDueResult, DailyPlanGeneratorService.name)
        );
      }

      // Generate daily actions from treatments
      const actionsPromises = treatmentsDueResult.val.map(
        async treatmentDue => {
          return this.dailyActionGenerator.generate(
            treatmentDue.treatment,
            treatmentDue.treatmentActionsDates,
            context
          );
        }
      );

      const actionsResults = await Promise.all(actionsPromises);
      const combinedActionsResult = Result.combine(actionsResults);
      if (combinedActionsResult.isFailure) {
        return Result.fail(
          formatError(combinedActionsResult, DailyPlanGeneratorService.name)
        );
      }

      // Flatten actions array
      const allActions = actionsResults.flatMap(result => result.val);

      // Generate daily tasks from monitoring parameters
      const tasksPromises = monitoringDueResult.val.map(async monitoringDue => {
        return this.dailyTaskGenerator.generate(
          monitoringDue.parameter,
          monitoringDue.parameterTasksDates,
          context
        );
      });

      const tasksResults = await Promise.all(tasksPromises);
      const combinedTasksResult = Result.combine(tasksResults);
      if (combinedTasksResult.isFailure) {
        return Result.fail(
          formatError(combinedTasksResult, DailyPlanGeneratorService.name)
        );
      }

      // Flatten tasks array
      const allTasks = tasksResults.flatMap(result => result.val);

      // Create an empty daily care record first
      const emptyRecordResult = DailyCareRecord.create(
        {
          date: date.toString(),
          treatmentActions: [],
          monitoringTasks: [],
        },
        this.idGenerator.generate().toValue()
      );

      if (emptyRecordResult.isFailure) {
        return Result.fail(
          formatError(emptyRecordResult, DailyPlanGeneratorService.name)
        );
      }

      const dailyRecord = emptyRecordResult.val;

      // Add all actions to the record
      for (const action of allActions) {
        dailyRecord.addAction(action);
      }

      // Add all tasks to the record
      for (const task of allTasks) {
        dailyRecord.addTask(task);
      }

      return Result.ok(dailyRecord);
    } catch (e) {
      return handleError(e);
    }
  }
}
