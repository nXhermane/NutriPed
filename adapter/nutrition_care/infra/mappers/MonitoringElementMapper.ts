import { MonitoringElement } from "@/core/nutrition_care";
import { MonitoringElementPersistenceDto } from "../dtos/carePhase/MonitoringElementPersistenceDto";
import { formatError, InfraMapToDomainError } from "@/core/shared";

export class MonitoringElementInfraMapper {
    toPersistence(entity: MonitoringElement): MonitoringElementPersistenceDto {
        return {
            id: entity.id as string,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            category: entity.getCategory(),
            code: entity.getCode(),
            duration: entity.getDuration(),
            frequency: entity.getFrequency(),
            source: entity.getSource(),
        }
    }

    toDomain(record: MonitoringElementPersistenceDto): MonitoringElement {


        const monitoringRes = MonitoringElement.create(record, record.id);
        if (monitoringRes.isFailure)
            throw new InfraMapToDomainError(
                formatError(monitoringRes, MonitoringElementInfraMapper.name)
            );

        return monitoringRes.val;
    }
}
