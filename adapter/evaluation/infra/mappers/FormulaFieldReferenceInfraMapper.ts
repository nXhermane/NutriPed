import {
  FormulaFieldReference,
  CreateFormulaFieldReference,
} from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
  IFormula,
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
      formula: {
        formula: {
          value: formula.formula,
          variables: formula.variablesExplanation
            ? Object.keys(formula.variablesExplanation)
            : [],
        },
        description: formula.description,
        variablesExplanation: formula.variablesExplanation,
      },
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
          formula: record.formula.formula,
          description: record.formula.description,
          variablesExplanation: record.formula.variablesExplanation,
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
