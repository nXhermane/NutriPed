import { InfrastructureMapper } from "@/core/shared";
import {
  OnGoingTreatment,
  CreateOnGoindTreatment,
} from "@/core/nutrition_care/domain/next/core/models/entities";
import { OnGoingTreatmentPersistenceDto } from "../../../dtos/next/core";

export class OnGoingTreatmentInfraMapper
  implements
    InfrastructureMapper<OnGoingTreatment, OnGoingTreatmentPersistenceDto>
{
  toPersistence(entity: OnGoingTreatment): OnGoingTreatmentPersistenceDto {
    const { recommendation } = entity.getProps();
    return {
      id: entity.id as string,
      code: entity.getCode(),
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate() || null,
      status: entity.getStatus(),
      nextActionDate: entity.getNextActionDate() || null,
      lastExecutionDate: entity.getLastExecutionDate() || null,
      recommendation: {
        id: recommendation.getId(),
        code: recommendation.getCode(),
        duration: recommendation.getDuration(),
        frequency: recommendation.getFrequency(),
        recommendationCode: recommendation.getRecommendatioCode(),
        type: recommendation.getType(),
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: OnGoingTreatmentPersistenceDto): OnGoingTreatment {
    const createProps: CreateOnGoindTreatment = {
      code: record.code as any,
      startDate: record.startDate,
      endDate: record.endDate,
      status: record.status,
      nextActionDate: record.nextActionDate,
      lastExecutionDate: record.lastExecutionDate,
      recommendation: record.recommendation,
    };

    const result = OnGoingTreatment.create(createProps, record.id);
    if (result.isFailure) {
      throw new Error(
        `Failed to create OnGoingTreatment from persistence data: ${result.err}`
      );
    }

    return result.val;
  }
}
