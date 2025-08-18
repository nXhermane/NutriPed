import { DiagnosticRule } from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { DiagnosticRulePersistenceDto } from "../dtos";

export class DiagnosticRuleInfraMapper
  implements InfrastructureMapper<DiagnosticRule, DiagnosticRulePersistenceDto>
{
  toPersistence(entity: DiagnosticRule): DiagnosticRulePersistenceDto {
    return {
      id: entity.id as string,
      code: entity.getCode(),
      conditions: entity.getConditions(),
      name: entity.getName(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: DiagnosticRulePersistenceDto): DiagnosticRule {
    const diagnosticRuleRes = DiagnosticRule.create(record, record.id);
    if (diagnosticRuleRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(diagnosticRuleRes, DiagnosticRuleInfraMapper.name)
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...props } =
      diagnosticRuleRes.val.getProps();
    return new DiagnosticRule({
      id,
      props,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
