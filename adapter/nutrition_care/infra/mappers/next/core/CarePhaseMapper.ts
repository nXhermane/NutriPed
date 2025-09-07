import { InfrastructureMapper } from "@/core/shared";
import { CarePhase } from "@/core/nutrition_care/domain/next/core/models/entities";
import { CarePhasePersistenceDto } from "../../../dtos/next/core";

export class CarePhaseInfraMapper
  implements InfrastructureMapper<CarePhase, CarePhasePersistenceDto>
{
  toPersistence(entity: CarePhase): CarePhasePersistenceDto {
    return {
      id: entity.id as string,
      status: entity.getStatus(),
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate() || null,
      monitoringParameters: entity.getMonitoringParameters().map(p => p.id),
      onGoingTreatments: entity.getOnGoingTreatments().map(t => t.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: CarePhasePersistenceDto): CarePhase {
    throw new Error("toDomain not implemented");
  }
}
