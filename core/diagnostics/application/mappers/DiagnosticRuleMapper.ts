import { ApplicationMapper } from "@shared";
import { DiagnosticRuleDto } from "../dtos";
import { DiagnosticRule } from "./../../domain";

export class DiagnosticRuleMapper
  implements ApplicationMapper<DiagnosticRule, DiagnosticRuleDto>
{
  toResponse(entity: DiagnosticRule): DiagnosticRuleDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      conditions: entity.getConditions(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
