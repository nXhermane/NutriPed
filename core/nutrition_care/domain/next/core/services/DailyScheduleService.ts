import {
  AggregateID,
  DomainDateTime,
  formatError,
  handleError,
  Result,
} from "@/core/shared";
import { OnGoingTreatment, MonitoringParameter } from "../models";
import {
  IDailyScheduleService,
  ITreatmentDateManagementService,
  TreatmentDueForDate,
  MonitoringParameterDueForDate,
} from "./interfaces";

export class DailyScheduleService implements IDailyScheduleService {
  constructor(
    private readonly treatmentDateManagementService: ITreatmentDateManagementService
  ) {}

  getTreatmentsDueForDate(
    treatments: OnGoingTreatment[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): Result<TreatmentDueForDate[]> {
    try {
      const mappedTreatmentDueForDate = new Map<
        AggregateID,
        TreatmentDueForDate
      >();
      let dueForDateTreatments =
        this.treatmentDateManagementService.getTreatmentsDueForDate(
          treatments,
          targetDate
        );
      while (dueForDateTreatments.length != 0) {
        const shouldContinusTreatments = [];
        for (const dueTreatment of dueForDateTreatments) {
          const nextActionDate = DomainDateTime.create(
            dueTreatment.getNextActionDate() ?? ""
          );
          if (nextActionDate.isFailure) {
            throw new Error("The next date can't be null here.");
          }
          // 1. On stocker la date dans le mappedTreatmentDueForDate
          if (mappedTreatmentDueForDate.has(dueTreatment.id)) {
            mappedTreatmentDueForDate
              .get(dueTreatment.id)
              ?.treatmentActionsDates.push(nextActionDate.val);
          } else {
            mappedTreatmentDueForDate.set(dueTreatment.id, {
              treatment: dueTreatment,
              treatmentActionsDates: [nextActionDate.val],
            });
          }
          // 2. On va marquer le onGoingTreatment comme executé
          const dateUpdateResult = this.markTreatmentAsExecuted(
            dueTreatment,
            nextActionDate.val
          );
          if (dateUpdateResult.isFailure) {
            return Result.fail(
              formatError(dateUpdateResult, DailyScheduleService.name)
            );
          }
          if (dateUpdateResult.val.shouldContinue) {
            shouldContinusTreatments.push(dueTreatment);
          }
        }
        dueForDateTreatments = shouldContinusTreatments;
      }
      return Result.ok(Array.from(mappedTreatmentDueForDate.values()));
    } catch (e) {
      return handleError(e);
    }
  }

  getMonitoringParametersDueForDate(
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): Result<MonitoringParameterDueForDate[]> {
    try {
      const mappedMonitoringParameterDueForDate = new Map<
        AggregateID,
        MonitoringParameterDueForDate
      >();
      let dueForDateParameters =
        this.treatmentDateManagementService.getMonitoringParametersDueForDate(
          parameters,
          targetDate
        );
      while (dueForDateParameters.length != 0) {
        const shouldContinusParameters = [];
        for (const dueParameter of dueForDateParameters) {
          const nextTaskDate = DomainDateTime.create(
            dueParameter.getNextTaskDate() ?? ""
          );
          if (nextTaskDate.isFailure) {
            throw new Error("The next date can't be null here.");
          }
          if (mappedMonitoringParameterDueForDate.has(dueParameter.id)) {
            mappedMonitoringParameterDueForDate
              .get(dueParameter.id)
              ?.parameterTasksDates.push(nextTaskDate.val);
          } else {
            mappedMonitoringParameterDueForDate.set(dueParameter.id, {
              parameter: dueParameter,
              parameterTasksDates: [nextTaskDate.val],
            });
          }
          const dateUpdateResult = this.markMonitoringParameterAsExecuted(
            dueParameter,
            nextTaskDate.val
          );
          if (dateUpdateResult.isFailure) {
            return Result.fail(
              formatError(dateUpdateResult, DailyScheduleService.name)
            );
          }
          if (dateUpdateResult.val.shouldContinue) {
            shouldContinusParameters.push(dueParameter);
          }
        }
        dueForDateParameters = shouldContinusParameters;
      }
      return Result.ok(
        Array.from(mappedMonitoringParameterDueForDate.values())
      );
    } catch (e) {
      return handleError(e);
    }
  }
  /**
   * Marque un traitement comme exécuté et met à jour sa prochaine date
   * @param treatment Le traitement exécuté
   * @param executionDate Date d'exécution (par défaut maintenant)
   * @returns Résultat de la mise à jour
   */
  private markTreatmentAsExecuted(
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
  /**
   * Marque un paramètre de monitoring comme exécuté et met à jour sa prochaine date
   * @param parameter Le paramètre exécuté
   * @param executionDate Date d'exécution (par défaut maintenant)
   * @returns Résultat de la mise à jour
   */
  private markMonitoringParameterAsExecuted(
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
}
