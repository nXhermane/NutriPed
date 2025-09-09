import { NextNutritionCare } from "@/core/nutrition_care";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@/core/shared";
import { NutritionalProductPersistenceDto } from "../../../dtos/next/nutritional_product";

export class NutritionalProductInfraMapper
  implements
  InfrastructureMapper<NextNutritionCare.NutritionalProduct, NutritionalProductPersistenceDto> {
  toPersistence(entity: NextNutritionCare.NutritionalProduct): NutritionalProductPersistenceDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      dosageTables: entity.getTables().map(table => ({
        applicability: {
          condition: table.applicability.getCondition(),
          description: table.applicability.getDescription(),
          variablesExplanation: table.applicability.getVariablesExplanation(),
        },
        conditionalDosageFormulas: table.conditionalDosageFormulas.map(
          conditionalDosageFormula => {
            const { applicabilities, formula } =
              conditionalDosageFormula.unpack();
            const { description, max, min, unit, variableExplanation } =
              formula.unpack();
            return {
              applicabilities: applicabilities.map(criterion => ({
                condition: criterion.getCondition(),
                description: criterion.getDescription(),
                variablesExplanation: criterion.getVariablesExplanation(),
              })),
              formula: {
                description,
                max: max === null ? null : max.unpack(),
                min: min.unpack(),
                unit: unit,
                variableExplanation,
              },
            };
          }
        ),
        dosages: table.dosages.map(dosage => dosage.unpack()),
        isAdmissionWeight: table.isAdmissionWeight,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: NutritionalProductPersistenceDto): NextNutritionCare.NutritionalProduct {
    const productRes = NextNutritionCare.NutritionalProduct.create(
      record as NextNutritionCare.CreateNutritionalProduct,
      record.id
    );

    if (productRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(productRes, NextNutritionCare.NutritionalProduct.name)
      );
    }
    const { id, createdAt, updatedAt, ...props } = productRes.val.getProps();
    return new NextNutritionCare.NutritionalProduct({ id, createdAt, updatedAt, props });
  }
}
