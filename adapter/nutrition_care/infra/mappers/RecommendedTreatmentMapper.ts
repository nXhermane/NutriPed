import { RecommendedTreatment } from "@/core/nutrition_care";
import { RecommendedTreatmentPersistenceDto } from "../dtos/carePhase/RecommendedTreatmentPersistenceDto";
import { formatError, InfraMapToDomainError } from "@/core/shared";

export class RecommendedTreatmentInfraMapper {
    toPersistence(entity: RecommendedTreatment): RecommendedTreatmentPersistenceDto {
        return {
            id: entity.id as string,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            applicabilyCondition: {
                condition: entity.getApplicabilyCondition().condition.unpack(),
                description: entity.getApplicabilyCondition().description,
                variablesExplanation: entity.getApplicabilyCondition().variablesExplanation
            },
            code: entity.getCode(),
            duration: entity.getDuration(),
            frequency: entity.getFrequency(),
            treatmentCode: entity.getTreatmentCode(),
            triggers: {
                onEnd: entity.getEndedTrigger().map(trigger => ({
                    action: trigger.action,
                    targetTreatment: trigger.targetTreatment.unpack(),
                })),
                onStart: entity.getStartedTriggers().map(trigger => ({
                    action: trigger.action,
                    targetTreatment: trigger.targetTreatment.unpack(),
                }))
            },
            type: entity.getType(),
            ajustmentPercentage: entity.getAjustmentPercentage()
        };
    }

    toDomain(record: RecommendedTreatmentPersistenceDto): RecommendedTreatment {
        const recommendedTreatmentRes = RecommendedTreatment.create(record, record.id);
        if (recommendedTreatmentRes.isFailure) {
            throw new InfraMapToDomainError(formatError(recommendedTreatmentRes, RecommendedTreatmentInfraMapper.name));
        }
        const { id, createdAt, updatedAt, ...props } = recommendedTreatmentRes.val.getProps();
        return new RecommendedTreatment({
            id, createdAt: record.createdAt, updatedAt: record.updatedAt, props
        })
    }
}
