import { ApplicationMapper } from "@/core/shared";
import { DailyCareActionDto } from "../dtos";
import { DailyCareAction } from "../../domain/next/core/models/entities";

export class DailyCareActionMapper implements ApplicationMapper<DailyCareAction, DailyCareActionDto> {
  toResponse(entity: DailyCareAction): DailyCareActionDto {
    const action = entity.getAction();
    return {
      id: entity.id,
      treatmentId: entity.getTreatmentId(),
      status: entity.getStatus(),
      type: entity.getType(),
      action: action,
      effectiveDate: entity.getEffectiveDate(),
      createdAt: entity.createdAt.toString(),
      updatedAt: entity.updatedAt.toString(),
    };
  }
}
