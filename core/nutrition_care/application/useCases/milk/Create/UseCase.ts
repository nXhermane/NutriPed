import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreateMilkRequest } from "./Request";
import { CreateMilkResponse } from "./Response";
import { Milk, MilkRepository } from "../../../../domain";

export class CreateMilkUseCase
  implements UseCase<CreateMilkRequest, CreateMilkResponse>
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly repo: MilkRepository
  ) {}
  async execute(request: CreateMilkRequest): Promise<CreateMilkResponse> {
    try {
      const newId = this.idGenerator.generate().toValue();
      const milkRes = Milk.create(request.data, newId);
      if (milkRes.isFailure) return left(milkRes);

      const milk = milkRes.val;
      await this.repo.save(milk);

      return right(Result.ok({ id: newId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
