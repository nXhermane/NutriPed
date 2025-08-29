import { CarePhase } from "./../entities";
import { DomainDateTime, EntityPropsBaseType } from "@/core/shared";

export enum PatientCareSessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface IPatientCareSession extends EntityPropsBaseType {
  status: PatientCareSessionStatus;
  startDate: DomainDateTime;
  endDate: DomainDateTime | null;
  currentPhase: CarePhase | null;
  currentDailyRecord: DailyCareRecord | null

}
