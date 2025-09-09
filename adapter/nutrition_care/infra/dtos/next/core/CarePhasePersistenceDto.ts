import { EntityPersistenceDto } from "@/adapter/shared";
import { AggregateID } from "@/core/shared";
import { CarePhaseStatus } from "@/core/nutrition_care/domain/next";
import { NextCore } from "@/core/nutrition_care";
import { CARE_PHASE_CODES } from "@/core/constants";

export interface CarePhasePersistenceDto extends EntityPersistenceDto {
  code: CARE_PHASE_CODES
  status: CarePhaseStatus;
  startDate: string;
  endDate: string | null;
  monitoringParameters: AggregateID[];
  onGoingTreatments: AggregateID[];
}
export interface CarePhasePersistenceRecordDto extends EntityPersistenceDto {
  code: CARE_PHASE_CODES;
  status: CarePhaseStatus;
  startDate: string;
  endDate: string | null;
  monitoringParameters: NextCore.MonitoringParameter[];
  onGoingTreatments: NextCore.OnGoingTreatment[];
}