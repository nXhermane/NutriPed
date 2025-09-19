import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { DeleteAnthropometricMeasureRequest } from "./Request";
import { DeleteAnthropometricMeasureResponse } from "./Response";
import {
  AnthropometricMeasure,
  AnthropometricMeasureRepository,
} from "../../../../../domain";
import { AnthropometricMeasureDto } from "../../../../dtos";

export class DeleteAnthropometricMeasureUseCase
  implements
    UseCase<
      DeleteAnthropometricMeasureRequest,
      DeleteAnthropometricMeasureResponse
    >
{
  constructor(
    private readonly anthropometricRepo: AnthropometricMeasureRepository,
    private readonly mapper: ApplicationMapper<
      AnthropometricMeasure,
      AnthropometricMeasureDto
    >
  ) {}
  async execute(
    request: DeleteAnthropometricMeasureRequest
  ): Promise<DeleteAnthropometricMeasureResponse> {
    try {
      const anthropometricMeasure = await this.anthropometricRepo.getById(
        request.id
      );
      anthropometricMeasure.delete();
      await this.anthropometricRepo.delete(anthropometricMeasure.id);
      return right(Result.ok(this.mapper.toResponse(anthropometricMeasure)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
