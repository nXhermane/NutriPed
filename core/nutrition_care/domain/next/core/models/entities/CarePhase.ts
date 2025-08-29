import { CARE_PHASE_CODES } from "@/core/constants";
import {
  AggregateID,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  SystemCode,
} from "@/core/shared";
import {
  CreateMonitoringParameter,
  MonitoringParameter,
} from "./MonitoringParameter";
import { CreateOnGoindTreatment, OnGoingTreatment } from "./OnGoingTreatment";
export enum CarePhaseStatus {
  FAILED = "failed",
  SUCCEED = "succeed",
  IN_PROGRESS = "in_progress",
}
export interface ICarePhase extends EntityPropsBaseType {
  code: SystemCode<CARE_PHASE_CODES>;
  status: CarePhaseStatus;
  startDate: DomainDateTime;
  endDate: DomainDateTime | null;
  monitoringParameters: MonitoringParameter[];
  onGoingTreatments: OnGoingTreatment[];
}

export interface CreateCarePhase {
  code: CARE_PHASE_CODES;
  status: CarePhaseStatus;
  startDate?: string;
  endDate: string | null;
  monitoringPrameters: (CreateMonitoringParameter & { id: AggregateID })[];
  onGoingTreatments: (CreateOnGoindTreatment & { id: AggregateID })[];
}

export class CarePhase extends Entity<ICarePhase> {
  public validate(): void {
    this._isValid = false;
    
    
    this._isValid = true;
  }
}
