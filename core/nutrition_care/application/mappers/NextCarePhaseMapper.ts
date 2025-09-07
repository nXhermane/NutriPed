import { ApplicationMapper } from "@/core/shared";
import { CarePhase } from "../../domain/next";
import { CarePhaseDto } from "../dtos/next/core/CarePhaseDto";

export class CarePhaseMapper implements ApplicationMapper<CarePhase, CarePhaseDto> {
    toResponse(entity: CarePhase): CarePhaseDto {
        return {
            id: entity.id,
            status: entity.getStatus(),
            startDate: entity.getStartDate(),
            endDate: entity.getEndDate(),
            monitoringParameters: entity.getMonitoringParameters().map(param => param.id),
            onGoingTreatments: entity.getOnGoingTreatments().map(treatment => treatment.id),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        }
    }

}