import { formatError, InfraMapToDomainError, InfrastructureMapper } from "@/core/shared";
import { CarePhase } from "@/core/nutrition_care/domain/next/core/models/entities";
import { CarePhasePersistenceDto, CarePhasePersistenceRecordDto } from "../../../dtos/next/core";

export class CarePhaseInfraMapper
  implements InfrastructureMapper<CarePhase, CarePhasePersistenceDto, CarePhasePersistenceRecordDto>
{
  toPersistence(entity: CarePhase): CarePhasePersistenceDto {
    return {
      id: entity.id as string,
      code: entity.getCode(),
      status: entity.getStatus(),
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate() || null,
      monitoringParameters: entity.getMonitoringParameters().map(p => p.id),
      onGoingTreatments: entity.getOnGoingTreatments().map(t => t.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: CarePhasePersistenceRecordDto): CarePhase {
    const carePhaseRes = CarePhase.create({
      code: record.code,
      status: record.status,
      startDate: record.startDate,
      endDate: record.endDate,
      monitoringParameters: record.monitoringParameters.map(p =>({
        startDate: p.getStartDate(),
        endDate: p.getEndDate(),
        nextTaskDate: p.getNextTaskDate(),
        lastExecutionDate: p.getLastExecutionDate(),
        element: {
          category:p.getElement().category,
          code:p.getElement().code.unpack(),
          duration:p.getElement().duration.unpack(),
          frequency:p.getElement().frequency.unpack(),
          id:p.getElement().id,
          source:p.getElement().source,
        },
        id: p.id,
      })),
      onGoingTreatments: record.onGoingTreatments.map(t => ({
        code: t.getCode(),
        endDate: t.getEndDate(),
        nextActionDate: t.getNextActionDate(),
        recommendation: {
          code: t.getRecommendation().code.unpack(),
          id: t.getRecommendation().id,
          type: t.getRecommendation().type,
          duration: t.getRecommendation().duration.unpack(),
          frequency: t.getRecommendation().frequency.unpack(),
          recommendationCode: t.getRecommendation().recommendationCode.unpack()
        },
        id: t.id,
      })),
    }, record.id);
    if (carePhaseRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(carePhaseRes, CarePhaseInfraMapper.name)
      );
    const { id, updatedAt, createdAt, ...props } = carePhaseRes.val.getProps();
    return new CarePhase({
      id,
      props,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
    });
  }
}
