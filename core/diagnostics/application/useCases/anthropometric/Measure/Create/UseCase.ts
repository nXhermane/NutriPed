import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreateAnthropometricMeasureRequest } from "./Request";
import { CreateAnthropometricMeasureResponse } from "./Response";
import {
  AnthropometricMeasure,
  AnthropometricMeasureRepository,
} from "../../../../../domain";

export class CreateAnthropometricMeasureUseCase
  implements
    UseCase<
      CreateAnthropometricMeasureRequest,
      CreateAnthropometricMeasureResponse
    >
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly anthropometricRepo: AnthropometricMeasureRepository
  ) {}
  async execute(
    request: CreateAnthropometricMeasureRequest
  ): Promise<CreateAnthropometricMeasureResponse> {
    try {
      const measureId = this.idGenerator.generate().toString();
      const anthropometricMeasure = AnthropometricMeasure.create(
        request.data,
        measureId
      );
      if (anthropometricMeasure.isFailure) return left(anthropometricMeasure);
      const exist = await this.anthropometricRepo.exist(
        anthropometricMeasure.val.getProps().code
      );
      if (exist)
        return left(
          Result.fail(
            `The anthropometric measure with this code [${anthropometricMeasure.val.getCode()}] already exist.`
          )
        );

      anthropometricMeasure.val.created();
      await this.anthropometricRepo.save(anthropometricMeasure.val);
      return right(Result.ok({ id: measureId }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
