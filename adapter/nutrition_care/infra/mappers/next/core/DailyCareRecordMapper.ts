import { InfrastructureMapper } from "@/core/shared";
import { DailyCareRecord, CreateDailyCareRecord } from "@/core/nutrition_care/domain/next/core/models/entities";
import { DailyCareRecordPersistenceDto } from "../../../dtos/next/core";
import { DailyCareActionInfraMapper } from "./DailyCareActionMapper";
import { DailyMonitoringTaskInfraMapper } from "./DailyMonitoringTaskMapper";

export class DailyCareRecordInfraMapper
  implements InfrastructureMapper<DailyCareRecord, DailyCareRecordPersistenceDto>
{
  private actionMapper = new DailyCareActionInfraMapper();
  private taskMapper = new DailyMonitoringTaskInfraMapper();

  toPersistence(entity: DailyCareRecord): DailyCareRecordPersistenceDto {
    return {
      id: entity.id as string,
      date: entity.getDate(),
      status: entity.getStatus(),
      treatmentActions: entity.props.treatmentActions.map(action => this.actionMapper.toPersistence(action)),
      monitoringTasks: entity.props.monitoringTasks.map(task => this.taskMapper.toPersistence(task)),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: DailyCareRecordPersistenceDto): DailyCareRecord {
    const createProps: CreateDailyCareRecord = {
      date: record.date,
      treatmentActions: record.treatmentActions.map(action => ({
        id: action.id,
        treatmentId: action.treatmentId,
        status: action.status,
        type: action.type,
        action: action.action,
        effectiveDate: action.effectiveDate,
      })),
      monitoringTasks: record.monitoringTasks.map(task => ({
        id: task.id,
        monitoringId: task.monitoringId,
        status: task.status,
        task: {
          category: task.task.category,
          code: task.task.code.unpack(),
        },
        effectiveDate: task.effectiveDate,
      })),
    };

    const result = DailyCareRecord.create(createProps, record.id);
    if (result.isFailure) {
      throw new Error(`Failed to create DailyCareRecord from persistence data: ${result.err}`);
    }

    return result.val;
  }
}
