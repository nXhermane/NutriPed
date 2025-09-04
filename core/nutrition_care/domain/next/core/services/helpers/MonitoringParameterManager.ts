import {
  BaseEntityProps,
  formatError,
  GenerateUniqueId,
  handleError,
  Result,
} from "@/core/shared";
import { IMonitoringElement } from "../../../../modules";
import {
  MonitoringParameter,
  CreateMonitoringParameterElement,
  CarePhase,
} from "../../models";
import { ITreatmentDateManagementService } from "../interfaces";
import {
  IMonitoringParameterManager,
  MonitoringParameterTransitionResult,
} from "./interfaces";

export class MonitoringParameterManager implements IMonitoringParameterManager {
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly treatmentDateManagementService: ITreatmentDateManagementService
  ) {}

  /**
   * Synchronise les éléments de monitoring recommandés avec les paramètres en cours
   */
  synchronizeMonitoringParameters(
    recommendedElements: (BaseEntityProps & IMonitoringElement)[],
    currentParameters: MonitoringParameter[]
  ): Result<MonitoringParameterTransitionResult> {
    try {
      const mappedCurrentParameters = new Map(
        currentParameters.map(param => [param.getElement().id, param])
      );

      const newParameters: MonitoringParameter[] = [];
      const reactivatedParameters: MonitoringParameter[] = [];

      // Traiter les éléments de monitoring recommandés
      for (const element of recommendedElements) {
        if (mappedCurrentParameters.has(element.id)) {
          const parameter = mappedCurrentParameters.get(element.id)!;
          // Réactiver si le paramètre était terminé
          if (parameter.getEndDate() !== null) {
            parameter.changeEndDate(null);
            // Régénérer la prochaine date de tâche lors de la réactivation
            this.treatmentDateManagementService.regenerateMonitoringDate(
              parameter
            );
            reactivatedParameters.push(parameter);
          }
        } else {
          const newParameterRes =
            this.createMonitoringParameterFromElement(element);
          if (newParameterRes.isFailure) {
            return Result.fail(
              formatError(newParameterRes, MonitoringParameterManager.name)
            );
          }
          newParameters.push(newParameterRes.val);
        }
      }

      // Identifier les paramètres à terminer
      const mappedRecommendedElements = new Map(
        recommendedElements.map(element => [element.id, element])
      );
      const endedParameters: MonitoringParameter[] = [];

      for (const parameter of currentParameters) {
        if (!mappedRecommendedElements.has(parameter.getElement().id)) {
          if (parameter.getEndDate() === null) {
            // Marquer comme terminé en mettant la date de fin à maintenant
            parameter.changeEndDate(null); // TODO: Utiliser DomainDateTime.now() si nécessaire
            endedParameters.push(parameter);
          }
        }
      }

      return Result.ok({
        newParameters,
        reactivatedParameters,
        endedParameters,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Applique les transitions de paramètres de monitoring à la phase de soins
   */
  applyMonitoringParameterTransitions(
    transitions: MonitoringParameterTransitionResult,
    targetCarePhase: CarePhase
  ): void {
    // Ajouter les nouveaux paramètres
    for (const parameter of transitions.newParameters) {
      targetCarePhase.addMonitoringParameter(parameter);
    }

    // Mettre à jour les paramètres réactivés
    for (const parameter of transitions.reactivatedParameters) {
      targetCarePhase.changeMonitoringParameter(parameter);
    }

    // Mettre à jour les paramètres terminés
    for (const parameter of transitions.endedParameters) {
      targetCarePhase.changeMonitoringParameter(parameter);
    }
  }

  /**
   * Crée un MonitoringParameter à partir d'un MonitoringElement
   */
  private createMonitoringParameterFromElement(
    element: BaseEntityProps & IMonitoringElement
  ): Result<MonitoringParameter> {
    try {
      const monitoringRes = MonitoringParameter.create(
        {
          endDate: null,
          nextTaskDate: null,
          lastExecutionDate: null,
          element: {
            id: element.id,
            category: element.category,
            source: element.source,
            code: element.code.unpack(),
            frequency: element.frequency.unpack(),
            duration: element.duration.unpack(),
          } as CreateMonitoringParameterElement,
        },
        this.idGenerator.generate().toValue()
      );

      if (monitoringRes.isSuccess) {
        // Générer automatiquement la première date de tâche
        this.treatmentDateManagementService.generateInitialMonitoringDate(
          monitoringRes.val
        );
      }

      return monitoringRes;
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
