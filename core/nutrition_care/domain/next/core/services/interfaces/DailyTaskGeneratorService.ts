import { DomainDateTime, Result } from "@/core/shared";
import { DailyMonitoringTask, MonitoringParameter } from "../../models";

export interface IDailyTaskGeneratorService {
  /**
   * Génère une tâche quotidienne pour un paramètre de monitoring
   * @param parameter Le paramètre de monitoring
   * @param taskEffectiveDates Les dates d'effet des tâches
   * @param context Le contexte
   * @returns La résultat de la génération
   */
  generate(
    parameter: MonitoringParameter,
    taskEffectiveDates: DomainDateTime[],
    context: Record<string, number>
  ): Promise<Result<DailyMonitoringTask[]>>;
}
