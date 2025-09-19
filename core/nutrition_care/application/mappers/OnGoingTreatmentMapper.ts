import { ApplicationMapper } from "@/core/shared";
import { NextCore } from "../../domain";
import { OnGoingTreatmentDto } from "../dtos/next/core/OnGoingTreatmentDto";

export class OnGoingTreatmentMapper
  implements ApplicationMapper<NextCore.OnGoingTreatment, OnGoingTreatmentDto>
{
  toResponse(entity: NextCore.OnGoingTreatment): OnGoingTreatmentDto {
    const recommendation = entity.getRecommendation();
    return {
      id: entity.id,
      code: entity.getCode(),
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate(),
      status: entity.getStatus(),
      nextActionDate: entity.getNextActionDate(),
      lastExecutionDate: entity.getLastExecutionDate(),
      recommendation: {
        id: recommendation.id,
        recommendationCode: recommendation.recommendationCode,
        type: recommendation.type,
        code: recommendation.code,
        duration: recommendation.duration,
        frequency: recommendation.frequency,
        adjustmentPercentage: recommendation.adjustmentPercentage,
      },
      createdAt: entity.createdAt.toString(),
      updatedAt: entity.updatedAt.toString(),
    };
  }
}
