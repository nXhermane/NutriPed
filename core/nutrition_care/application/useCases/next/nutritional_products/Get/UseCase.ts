import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
  SystemCode,
  Guard,
} from "@shared";
import { GetNutritionalProductRequest } from "./Request";
import { GetNutritionalProductResponse } from "./Response";
import { NutritionalProductDto } from "@/core/nutrition_care/application/dtos/next/nutritional_products";
import { NextNutritionCare } from "@/core/nutrition_care/domain";

export class GetNutritionalProductUseCase
  implements
    UseCase<GetNutritionalProductRequest, GetNutritionalProductResponse>
{
  constructor(
    private readonly repo: NextNutritionCare.NutritionalProductRepository,
    private readonly mapper: ApplicationMapper<
      NextNutritionCare.NutritionalProduct,
      NutritionalProductDto
    >
  ) {}
  async execute(
    request: GetNutritionalProductRequest
  ): Promise<GetNutritionalProductResponse> {
    try {
      const nutritionalProducts = [];
      if (request.code && !request.id) {
        const codeRes = SystemCode.create(request.code);
        if (codeRes.isFailure) {
          return left(codeRes);
        }
        const product = await this.repo.getByCode(codeRes.val);
        nutritionalProducts.push(product);
      } else if (request.id && !request.code) {
        const product = await this.repo.getById(request.id);
        nutritionalProducts.push(product);
      } else {
        nutritionalProducts.push(...(await this.repo.getAll()));
      }
      if (Guard.isEmpty(nutritionalProducts).succeeded) {
        return left(Result.fail("The nutritional products not found."));
      }
      return right(
        Result.ok(
          nutritionalProducts.map(product => this.mapper.toResponse(product))
        )
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
