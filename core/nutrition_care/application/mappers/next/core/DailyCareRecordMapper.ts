import { ApplicationMapper } from "@shared";
import { DailyCareRecord } from "../../../../domain/next/core/models/entities/DailyCareRecord";
import { DailyCareRecordDto } from "../../../dtos/core/PatientCareSessionDto";

/**
 * Mapper pour les records de soin quotidien
 * Convertit les entités domaine vers les DTOs d'application
 */
export class DailyCareRecordMapper
  implements ApplicationMapper<DailyCareRecord, DailyCareRecordDto>
{
  /**
   * Convertit une entité DailyCareRecord vers un DTO
   * @param entity Entité DailyCareRecord du domaine
   */
  toResponse(entity: DailyCareRecord): DailyCareRecordDto {
    const actions = entity.getActions ? entity.getActions() : [];
    const tasks = entity.getTasks ? entity.getTasks() : [];

    const completedActions = actions.filter(
      (action: any) => action.getStatus() === "completed"
    ).length;
    const completedTasks = tasks.filter(
      (task: any) => task.getStatus() === "completed"
    ).length;

    return {
      id: entity.id,
      date: entity.getDate(),
      status: entity.getStatus(),
      actionsCount: actions.length,
      tasksCount: tasks.length,
      completedActionsCount: completedActions,
      completedTasksCount: completedTasks,
      completionPercentage: this.calculateCompletionPercentage(
        actions.length + tasks.length,
        completedActions + completedTasks
      ),
    };
  }

  /**
   * Calcule le pourcentage de completion
   */
  private calculateCompletionPercentage(
    total: number,
    completed: number
  ): number {
    if (total === 0) return 100;
    return Math.round((completed / total) * 100);
  }
}
