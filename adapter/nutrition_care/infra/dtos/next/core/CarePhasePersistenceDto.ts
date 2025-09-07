import { EntityPersistenceDto } from "@/adapter/shared";
import { AggregateID } from "@/core/shared";
import { CarePhaseStatus } from "@/core/nutrition_care/domain/next";

export interface CarePhasePersistenceDto extends EntityPersistenceDto {
  status: CarePhaseStatus;
  startDate: string;
  endDate: string | null;
  monitoringParameters: AggregateID[];
  onGoingTreatments: AggregateID[];
}
