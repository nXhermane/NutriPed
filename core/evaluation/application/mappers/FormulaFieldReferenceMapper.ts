import { ApplicationMapper } from "@/core/shared";
import { FormulaFieldReference } from "../../domain";
import { FormulaFieldReferenceDto } from "../dtos";

export class FormulaFieldRefrenceMapper
  implements ApplicationMapper<FormulaFieldReference, FormulaFieldReferenceDto>
{
  toResponse(entity: FormulaFieldReference): FormulaFieldReferenceDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      formula: entity.getFormula(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
