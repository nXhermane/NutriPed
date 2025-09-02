import {
  FormulaFieldReference,
  CreateFormulaFieldReference,
} from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
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
    return {
      id: entity.id,
      code: entity.getCode(),
      formula: entity.getFormula(),
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
        formula: record.formula,
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
