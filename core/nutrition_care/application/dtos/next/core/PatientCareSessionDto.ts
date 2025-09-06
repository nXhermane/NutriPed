import { AggregateID } from "@shared";

/**
 * Types de statut de session de soin patient
 */
export enum PatientCareSessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  WAITING_FOR_USER_RESPONSE = "WAITING_FOR_USER_RESPONSE",
}

/**
 * Types de messages utilisateur
 */
export enum MessageType {
  PHASE_TRANSITION_REQUEST = "PHASE_TRANSITION_REQUEST",
  PHASE_FAILURE_NOTIFICATION = "PHASE_FAILURE_NOTIFICATION",
  MISSING_VARIABLES_NOTIFICATION = "MISSING_VARIABLES_NOTIFICATION",
  USER_DECISION_REQUEST = "USER_DECISION_REQUEST",
  GENERAL_NOTIFICATION = "GENERAL_NOTIFICATION",
}

/**
 * Types de décisions utilisateur
 */
export enum DecisionType {
  PHASE_TRANSITION_CONFIRMATION = "PHASE_TRANSITION_CONFIRMATION",
  PHASE_RETRY_DECISION = "PHASE_RETRY_DECISION",
  VARIABLE_PROVISION = "VARIABLE_PROVISION",
  TREATMENT_ADJUSTMENT = "TREATMENT_ADJUSTMENT",
}

/**
 * DTO pour les informations de session de soin patient
 * Utilisé par l'interface utilisateur
 */
export type PatientCareSessionDto = {
  id: AggregateID;
  patientId: AggregateID;
  status: PatientCareSessionStatus;
  startDate: string;
  endDate: string | null;
  currentPhase?: CarePhaseDto;
  currentDailyRecord?: DailyCareRecordDto;
  createdAt: string;
  updatedAt: string;
};

/**
 * DTO pour créer une nouvelle session de soin
 */
export type CreatePatientCareSessionDto = {
  patientId: AggregateID;
};

/**
 * DTO pour le statut de session
 */
export type PatientCareSessionStatusDto = {
  session: PatientCareSessionDto;
  currentRecord?: DailyCareRecordDto;
  pendingItems: PendingItemDto[];
  completionStatus: string;
  nextActions: string[];
  pendingMessages: MessageDto[];
};

/**
 * DTO pour les éléments en attente
 */
export type PendingItemDto = {
  id: AggregateID;
  type: "action" | "task";
  code: string;
  name: string;
  status: string;
  effectiveDate: string;
};

/**
 * DTO pour les phases de soin
 */
export type CarePhaseDto = {
  id: AggregateID;
  code: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string | null;
};

/**
 * DTO pour les records de soin quotidien
 */
export type DailyCareRecordDto = {
  id: AggregateID;
  date: string;
  status: string;
  actionsCount: number;
  tasksCount: number;
  completedActionsCount: number;
  completedTasksCount: number;
  completionPercentage: number;
};

/**
 * DTO pour les actions de soin
 */
export type CareActionDto = {
  id: AggregateID;
  treatmentId: AggregateID;
  type: string;
  status: string;
  effectiveDate: string;
  productType?: string;
  calculatedQuantity?: number;
  recommendedQuantity?: number;
};

/**
 * DTO pour les tâches de soin
 */
export type CareTaskDto = {
  id: AggregateID;
  monitoringId: AggregateID;
  status: string;
  effectiveDate: string;
  taskCode: string;
  taskName: string;
};

/**
 * DTO pour les messages utilisateur
 */
export type MessageDto = {
  id: AggregateID;
  type: MessageType;
  content: string;
  timestamp: string;
  requiresResponse: boolean;
  decisionType?: DecisionType;
};

/**
 * DTO pour les réponses utilisateur
 */
export type UserResponseDto = {
  messageId: AggregateID;
  response: string;
  timestamp: string;
  decisionData?: Record<string, any>;
};

/**
 * DTO pour les résultats d'orchestration
 */
export type OrchestratorResultDto = {
  success: boolean;
  operation: string;
  message: string;
  requiresUserAction?: boolean;
  nextOperation?: string;
};
