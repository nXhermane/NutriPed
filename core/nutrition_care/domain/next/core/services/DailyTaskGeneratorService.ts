import {
  CreateMonitoringTask,
  DailyMonitoringTask,
  MonitoringParameter,
  MonitoringParameterElement,
  MonitoringTaskCategory,
} from "../models";
import {
  DomainDateTime,
  formatError,
  GenerateUniqueId,
  Result,
} from "@/core/shared";
import { IDailyTaskGeneratorService } from "./interfaces";
import { handleError } from "@/core/shared";
import {
  MONITORING_ELEMENT_CATEGORY,
  MONITORING_VALUE_SOURCE,
} from "@/core/constants";

export class DailyTaskGeneratorService implements IDailyTaskGeneratorService {
  constructor(private readonly idGenerator: GenerateUniqueId) {}
  async generate(
    parameter: MonitoringParameter,
    taskEffectiveDates: DomainDateTime[],
    context: Record<string, number>
  ): Promise<Result<DailyMonitoringTask[]>> {
    try {
      const element = parameter.getProps().element;
      const taskRes = this.generateTask(element);
      if (taskRes.isFailure) {
        return Result.fail(
          formatError(taskRes, DailyTaskGeneratorService.name)
        );
      }
      const task = taskRes.val;
      const dailyMonitoringTasksResults = [];
      for (const effectiveDate of taskEffectiveDates) {
        dailyMonitoringTasksResults.push(
          DailyMonitoringTask.create(
            {
              monitoringId: parameter.id,
              task,
              effectiveDate: effectiveDate.toString()
            },
            this.idGenerator.generate().toValue()
          )
        );
      }

      return Result.ok(dailyMonitoringTasksResults.map(res => res.val));
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private generateTask(
    element: MonitoringParameterElement
  ): Result<CreateMonitoringTask> {
    try {
      if (element.getSource() === MONITORING_VALUE_SOURCE.CALCULATED) {
        return Result.ok({
          category: MonitoringTaskCategory.DYNAMIC_CALCUL,
          code: element.getCode(),
        });
      }
      switch (element.getCategory()) {
        case MONITORING_ELEMENT_CATEGORY.ANTHROPOMETRIC: {
          return Result.ok({
            category: MonitoringTaskCategory.ANTHROP,
            code: element.getCode(),
          });
        }
        case MONITORING_ELEMENT_CATEGORY.BIOCHEMICAL: {
          return Result.ok({
            category: MonitoringTaskCategory.BIOLOGICAL,
            code: element.getCode(),
          });
        }
        case MONITORING_ELEMENT_CATEGORY.CLINICAL_SIGNS: {
          return Result.ok({
            category: MonitoringTaskCategory.CLINICAL,
            code: element.getCode(),
          });
        }
        case MONITORING_ELEMENT_CATEGORY.DATA_FIELD: {
          return Result.ok({
            category: MonitoringTaskCategory.DATA_FIELD,
            code: element.getCode(),
          });
        }
        default:
          return Result.fail(
            "The monitoring type or categories is not supported."
          );
      }
    } catch (e) {
      return handleError(e);
    }
  }
}
