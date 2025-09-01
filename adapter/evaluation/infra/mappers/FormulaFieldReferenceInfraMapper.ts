import {
  FormulaFieldReference,
  CreateFormulaFieldReference,
} from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
  Formula,
} from "@/core/shared";
import { FormulaFieldReferencePersistenceDto } from "../dtos";

export class FormulaFieldReferenceInfraMapper
  implements
    InfrastructureMapper<
      FormulaFieldReference,
      FormulaFieldReferencePersistenceDto
    >
{
  toPersistence(
    entity: FormulaFieldReference
  ): FormulaFieldReferencePersistenceDto {
    const formula = entity.getFormula();
    return {
      id: entity.id,
      code: entity.getCode(),
      formula: formula.formula,
      description: formula.description,
      variablesExplanation: formula.variablesExplanation,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(
    record: FormulaFieldReferencePersistenceDto
  ): FormulaFieldReference {
    const formulaFieldRes = FormulaFieldReference.create(
      {
        code: record.code,
        formula: {
          formula: record.formula,
          description: record.description,
          variablesExplanation: record.variablesExplanation,
        },
      } as CreateFormulaFieldReference,
      record.id
    );

    if (formulaFieldRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(formulaFieldRes, FormulaFieldReference.name)
      );
    }
    return formulaFieldRes.val;
  }
}
