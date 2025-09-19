import { InfrastructureMapper } from "@/core/shared";
import {
  DailyCareRecord,
  CreateDailyCareRecord,
  DailyCareActionType,
} from "@/core/nutrition_care/domain/next/core/models/entities";
import {
  DailyCareRecordPersistenceDto,
  DailyCareRecordPersistenceRecordDto,
} from "../../../dtos/next/core";
import { NextCore } from "@/core/nutrition_care";

export class DailyCareRecordInfraMapper
  implements
    InfrastructureMapper<
      DailyCareRecord,
      DailyCareRecordPersistenceDto,
      DailyCareRecordPersistenceRecordDto
    >
{
  toPersistence(entity: DailyCareRecord): DailyCareRecordPersistenceDto {
    return {
      id: entity.id as string,
      date: entity.getDate(),
      status: entity.getStatus(),
      treatmentActions: entity.props.treatmentActions.map(action => action.id),
      monitoringTasks: entity.props.monitoringTasks.map(task => task.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: DailyCareRecordPersistenceRecordDto): DailyCareRecord {
    const createProps: CreateDailyCareRecord = {
      date: record.date,
      status: record.status,
      treatmentActions: record.treatmentActions.map(
        action =>
          ({
            effectiveDate: action.getEffectiveDate(),
            id: action.id,
            action:
              action.getType() === DailyCareActionType.NUTRITIONAL_ACTION
                ? {
                    calcultedQuantity: (
                      action.getProps().action as NextCore.NutritionalAction
                    ).getCalculatedQuantity(),
                    recommendedQuantity: (
                      action.getProps().action as NextCore.NutritionalAction
                    ).getRecommendQuantity(),
                    feedingFrequencies: (
                      action.getProps().action as NextCore.NutritionalAction
                    ).getFeedingFrequencies(),
                  }
                : {
                    dailyDosage: (
                      action.getProps().action as NextCore.MedicalAction
                    ).getDailyDosage(),
                    dailyFrequency: (
                      action.getProps().action as NextCore.MedicalAction
                    ).getDailyFrequency(),
                    dosage: (
                      action.getProps().action as NextCore.MedicalAction
                    ).getDosage(),
                  },
            treatmentId: action.getTreatmentId(),
            type: action.getType(),
            status: action.getStatus(),
          }) as any
      ),
      monitoringTasks: record.monitoringTasks.map(task => ({
        effectiveDate: task.getEffectiveDate(),
        id: task.id,
        task: {
          category: task.getTask().category,
          code: task.getTask().code.unpack(),
        },
        monitoringId: task.getMonitoringId(),
        status: task.getStatus(),
      })),
    };

    const result = DailyCareRecord.create(createProps, record.id);
    if (result.isFailure) {
      throw new Error(
        `Failed to create DailyCareRecord from persistence data: ${result.err}`
      );
    }

    return result.val;
  }
}
