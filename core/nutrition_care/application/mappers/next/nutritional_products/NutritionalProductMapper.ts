import { ApplicationMapper } from "@/core/shared";
import { NutritionalProductDto } from "../../../dtos/next/nutritional_products";
import { NextNutritionCare } from "@/core/nutrition_care/domain";


export class NutritionalProductMapper implements ApplicationMapper<NextNutritionCare.NutritionalProduct, NutritionalProductDto> {
  toResponse(entity: NextNutritionCare.NutritionalProduct): NutritionalProductDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      dosageTables: entity.getTables().map((table) => ({
        applicability: {
          condition: table.applicability.getCondition(),
          description: table.applicability.getDescription(),
          variablesExplanation: table.applicability.getVariablesExplanation(),
        },
        conditionalDosageFormulas: table.conditionalDosageFormulas.map((conditionalDosageFormula) => {
           const {applicabilities,formula} = conditionalDosageFormula.unpack();
           const {description,max,min,unit,variableExplanation} = formula.unpack();
          return {
           applicabilities: applicabilities.map(criterion => ({
            condition: criterion.getCondition(),
            description: criterion.getDescription(),
            variablesExplanation: criterion.getVariablesExplanation()
           })),
           formula:  {
            description,max: max === null ? null : max.unpack(),
            min: min.unpack(), 
            unit: unit,
            variableExplanation
           }
          }
        }),
        dosages: table.dosages.map((dosage) => dosage.unpack()),
        isAdmissionWeight: table.isAdmissionWeight,
      })),
      createdAt:entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
