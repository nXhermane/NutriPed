import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
  SystemCode,
} from "@shared";
import { CreateMilkRequest } from "./Request";
import { CreateMilkResponse } from "./Response";
import { NextNutritionCare } from "@/core/nutrition_care/domain";

export class CreateMilkUseCase
  implements UseCase<CreateMilkRequest, CreateMilkResponse>
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly repo: NextNutritionCare.MilkRepository
  ) {}
  async execute(request: CreateMilkRequest): Promise<CreateMilkResponse> {
    try {
      const newId = this.idGenerator.generate().toValue();

      // Check if milk with this code already exists
      const codeResult = SystemCode.create(request.data.code);
      if (codeResult.isFailure) {
        return left(codeResult);
      }
      const existingMilk = await this.repo.exist(codeResult.val);
      if (existingMilk) {
        return left(
          Result.fail(
            `The milk with this code [${request.data.code}] already exists.`
          )
        );
      }

      // Create the milk entity
      const milkResult = NextNutritionCare.Milk.create(request.data, newId);

      if (milkResult.isFailure) {
        return left(milkResult);
      }

      const milk = milkResult.val;

      // Save to repository
      await this.repo.save(milk);

      return right(Result.ok({ id: newId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
