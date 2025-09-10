import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
  SystemCode,
} from "@shared";
import { CreateNutritionalProductRequest } from "./Request";
import { CreateNutritionalProductResponse } from "./Response";
import { NextNutritionCare } from "@/core/nutrition_care/domain";

export class CreateNutritionalProductUseCase
  implements
    UseCase<CreateNutritionalProductRequest, CreateNutritionalProductResponse>
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly repo: NextNutritionCare.NutritionalProductRepository
  ) {}
  async execute(
    request: CreateNutritionalProductRequest
  ): Promise<CreateNutritionalProductResponse> {
    try {
      const newId = this.idGenerator.generate().toValue();

      // Check if nutritional product with this code already exists
      const codeResult = SystemCode.create(request.data.code);
      if (codeResult.isFailure) {
        return left(codeResult);
      }
      const existingProduct = await this.repo.exist(codeResult.val);
      if (existingProduct) {
        return left(
          Result.fail(
            `The nutritional product with this code [${request.data.code}] already exists.`
          )
        );
      }

      // Create the nutritional product entity
      const nutritionalProductResult =
        NextNutritionCare.NutritionalProduct.create(request.data, newId);

      if (nutritionalProductResult.isFailure) {
        return left(nutritionalProductResult);
      }

      const nutritionalProduct = nutritionalProductResult.val;

      // Save to repository
      await this.repo.save(nutritionalProduct);

      return right(Result.ok({ id: newId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
