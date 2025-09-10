import { IMonitoringElement } from "@/core/nutrition_care/domain/modules";
import { BaseEntityProps, Result } from "@/core/shared";
import { CarePhase, MonitoringParameter } from "../../../models";

export interface MonitoringParameterTransitionResult {
  newParameters: MonitoringParameter[];
  reactivatedParameters: MonitoringParameter[];
  endedParameters: MonitoringParameter[];
}

export interface IMonitoringParameterManager {
  /**
   * Synchronise les éléments de monitoring recommandés avec les paramètres en cours
   */
  synchronizeMonitoringParameters(
    recommendedElements: (BaseEntityProps & IMonitoringElement)[],
    currentParameters: MonitoringParameter[]
  ): Result<MonitoringParameterTransitionResult>;
  /**
   * Applique les transitions de paramètres de monitoring à la phase de soins
   */
  applyMonitoringParameterTransitions(
    transitions: MonitoringParameterTransitionResult,
    targetCarePhase: CarePhase
  ): void;
}
