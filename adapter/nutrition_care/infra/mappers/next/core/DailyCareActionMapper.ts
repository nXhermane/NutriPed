import { InfrastructureMapper } from "@/core/shared";
import { DailyCareAction, CreateDailyCareAction } from "@/core/nutrition_care/domain/next/core/models/entities";
import { DailyCareActionPersistenceDto } from "../../../dtos/next/core";
import { NutritionalAction } from "@/core/nutrition_care/domain/next";
import { Action } from "@reduxjs/toolkit";

export class DailyCareActionInfraMapper
  implements InfrastructureMapper<DailyCareAction, DailyCareActionPersistenceDto> {
  toPersistence(entity: DailyCareAction): DailyCareActionPersistenceDto {
    const { action } = entity.getProps();
    const createAction: DailyCareActionPersistenceDto["action"] = action instanceof NutritionalAction ? {
      productType: action.getProductType(),
  calcultedQuantity: action.getCalculatedQuantity(),
  recommendedQuantity: action.getRecommendQuantity(),
  feedingFrequencies: action.getFeedingFrequencies()
    } : {
      dailyDosage: action.getDailyDosage(),
      dailyFrequency: action.getDailyFrequency(),
      dosage: action.getDosage()
    }
    return {
      id: entity.id as string,
      treatmentId: entity.getTreatmentId(),
      status: entity.getStatus(),
      type: entity.getType(),
      action:createAction,
        effectiveDate: entity.getEffectiveDate(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: DailyCareActionPersistenceDto): DailyCareAction {
    const createProps: CreateDailyCareAction = {
      treatmentId: record.treatmentId,
      status: record.status,
      type: record.type,
      action: record.action,
      effectiveDate: record.effectiveDate,
    };

    const result = DailyCareAction.create(createProps, record.id);
    if (result.isFailure) {
      throw new Error(`Failed to create DailyCareAction from persistence data: ${result.err}`);
    }

    return result.val;
  }
}
