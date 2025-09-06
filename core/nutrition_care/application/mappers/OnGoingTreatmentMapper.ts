import { ApplicationMapper } from "@/core/shared";
import { OnGoingTreatmentDto } from "../dtos";
import { OnGoingTreatment } from "../../domain/next/core/models/entities";

export class OnGoingTreatmentMapper implements ApplicationMapper<OnGoingTreatment, OnGoingTreatmentDto> {
  toResponse(entity: OnGoingTreatment): OnGoingTreatmentDto {
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
