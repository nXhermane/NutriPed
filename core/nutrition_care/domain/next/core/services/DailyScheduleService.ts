import { DomainDateTime, formatError, Result } from "@/core/shared";
import {
  OnGoingTreatment,
  MonitoringParameter,
  IDailyCareAction,
} from "../models";
import {
  IDailyScheduleService,
  ITreatmentDateManagementService,
} from "./interfaces";

export class DailyScheduleService implements IDailyScheduleService {
  constructor(
    private readonly treatmentDateManagementService: ITreatmentDateManagementService
  ) {}

  getTreatmentsDueForDate(
    treatments: OnGoingTreatment[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): OnGoingTreatment[] {
    return this.treatmentDateManagementService.getTreatmentsDueForDate(
      treatments,
      targetDate
    );
  }

  getMonitoringParametersDueForDate(
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): MonitoringParameter[] {
    return this.treatmentDateManagementService.getMonitoringParametersDueForDate(
      parameters,
      targetDate
    );
  }

  markTreatmentAsExecuted(
    treatment: OnGoingTreatment,
    executionDate: DomainDateTime = DomainDateTime.now()
  ): Result<{ shouldContinue: boolean; treatmentCompleted: boolean }> {
    try {
      const updateResult =
        this.treatmentDateManagementService.updateTreatmentDateAfterExecution(
          treatment,
          executionDate
        );
      if (updateResult.isSuccess) {
        return Result.ok({
          shouldContinue: updateResult.val.shouldContinue,
          treatmentCompleted: updateResult.val.completed,
        });
      }
      return Result.fail(formatError(updateResult, DailyScheduleService.name));
    } catch (error) {
      return Result.fail(
        `Failed to update treatment after execution: ${error}`
      );
    }
  }

  markMonitoringParameterAsExecuted(
    parameter: MonitoringParameter,
    executionDate: DomainDateTime = DomainDateTime.now()
  ): Result<{ shouldContinue: boolean; monitoringEnded: boolean }> {
    try {
      const updateResult =
        this.treatmentDateManagementService.updateMonitoringDateAfterExecution(
          parameter,
          executionDate
        );
      if (updateResult.isSuccess) {
        return Result.ok({
          shouldContinue: updateResult.val.shouldContinue,
          monitoringEnded: updateResult.val.completed,
        });
      }
      return Result.fail(formatError(updateResult, DailyScheduleService.name));
    } catch (error) {
      return Result.fail(
        `Failed to update monitoring parameter after execution: ${error}`
      );
    }
  }

  getDailyScheduleSummary(
    treatments: OnGoingTreatment[],
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): {
    treatmentsDue: OnGoingTreatment[];
    monitoringParametersDue: MonitoringParameter[];
    totalActions: number;
    totalTasks: number;
  } {
    const treatmentsDue = this.getTreatmentsDueForDate(treatments, targetDate);
    const monitoringParametersDue = this.getMonitoringParametersDueForDate(
      parameters,
      targetDate
    );

    return {
      treatmentsDue,
      monitoringParametersDue,
      totalActions: treatmentsDue.length,
      totalTasks: monitoringParametersDue.length,
    };
  }
}
