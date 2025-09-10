import { ApplicationMapper } from "@shared";
import { PatientCareSession } from "../../../../domain/next/core/models/aggregate/PatientCareSession";
import { CarePhase } from "../../../../domain/next/core/models/entities/CarePhase";
import { DailyCareRecord } from "../../../../domain/next/core/models/entities/DailyCareRecord";
import {
  PatientCareSessionDto,
  PatientCareSessionStatusDto,
  PendingItemDto,
  MessageDto,
  CarePhaseDto,
  DailyCareRecordDto,
} from "../../../dtos/core/PatientCareSessionDto";

/**
 * Mapper pour les sessions de soin patient
 * Convertit les entités domaine vers les DTOs d'application
 */
export class PatientCareSessionMapper
  implements ApplicationMapper<PatientCareSession, PatientCareSessionDto>
{
  constructor(
    private readonly carePhaseMapper: ApplicationMapper<
      CarePhase,
      CarePhaseDto
    >,
    private readonly dailyCareRecordMapper: ApplicationMapper<
      DailyCareRecord,
      DailyCareRecordDto
    >
  ) {}

  /**
   * Convertit une entité PatientCareSession vers un DTO
   */
  toResponse(entity: PatientCareSession): PatientCareSessionDto {
    const props = entity.getProps();

    return {
      id: entity.id,
      patientId: entity.getPatientId(),
      status: entity.getStatus(),
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate(),
      currentPhase: props.currentPhase
        ? this.carePhaseMapper.toResponse(props.currentPhase)
        : undefined,
      currentDailyRecord: props.currentDailyRecord
        ? this.dailyCareRecordMapper.toResponse(props.currentDailyRecord)
        : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Convertit une session vers un DTO de statut complet
   */
  toStatusResponse(entity: PatientCareSession): PatientCareSessionStatusDto {
    const currentRecord = entity.getCurrentDailyRecord();
    const pendingItems = currentRecord
      ? this.getPendingItems(currentRecord)
      : [];

    return {
      session: this.toResponse(entity),
      currentRecord: currentRecord
        ? this.dailyCareRecordMapper.toResponse(currentRecord)
        : undefined,
      pendingItems,
      completionStatus: currentRecord ? currentRecord.getStatus() : "NO_RECORD",
      nextActions: this.determineNextActions(entity),
      pendingMessages: entity
        .getPendingMessages()
        .map(msg => this.mapMessageToDto(msg)),
    };
  }

  /**
   * Extrait les éléments en attente d'un record quotidien
   */
  private getPendingItems(record: any): PendingItemDto[] {
    const pendingItems: PendingItemDto[] = [];
    const actions = record.getActions ? record.getActions() : [];
    const tasks = record.getTasks ? record.getTasks() : [];

    // Actions en attente
    actions.forEach((action: any) => {
      if (action.getStatus() !== "completed") {
        pendingItems.push({
          id: action.id,
          type: "action",
          code: action.getTreatmentId(),
          name: this.getActionName(action),
          status: action.getStatus(),
          effectiveDate: action.getEffectiveDate(),
        });
      }
    });

    // Tâches en attente
    tasks.forEach((task: any) => {
      if (task.getStatus() !== "completed") {
        pendingItems.push({
          id: task.id,
          type: "task",
          code: task.getMonitoringId(),
          name: this.getTaskName(task),
          status: task.getStatus(),
          effectiveDate: task.getEffectiveDate(),
        });
      }
    });

    return pendingItems;
  }

  /**
   * Détermine les prochaines actions possibles
   */
  private determineNextActions(entity: PatientCareSession): string[] {
    const actions: string[] = [];
    const currentRecord = entity.getCurrentDailyRecord();

    if (!currentRecord) {
      actions.push("GENERATE_DAILY_PLAN");
      return actions;
    }

    if (currentRecord.isCompleted && currentRecord.isCompleted()) {
      actions.push("TRANSITION_PHASE");
    } else {
      actions.push("COMPLETE_DAILY_RECORD");
    }

    if (entity.hasPendingMessages()) {
      actions.push("HANDLE_USER_RESPONSE");
    }

    return actions;
  }

  /**
   * Mappe un message domaine vers un DTO
   */
  private mapMessageToDto(message: any): MessageDto {
    return {
      id: message.id,
      type: message.type,
      content: message.content,
      timestamp: message.timestamp.toString(),
      requiresResponse: message.requiresResponse,
      decisionType: message.decisionType,
    };
  }

  /**
   * Extrait le nom d'une action
   */
  private getActionName(action: any): string {
    // Logique pour extraire le nom de l'action depuis l'entité
    if (action.getAction && action.getAction().getProductType) {
      return action.getAction().getProductType();
    }
    return "Action de soin";
  }

  /**
   * Extrait le nom d'une tâche
   */
  private getTaskName(task: any): string {
    // Logique pour extraire le nom de la tâche depuis l'entité
    if (task.getTask && task.getTask().getCode) {
      return task.getTask().getCode();
    }
    return "Tâche de monitoring";
  }
}
