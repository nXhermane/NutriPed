import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { GetAnthropometricMeasureRequest } from "./Request";
import { GetAnthropometricMeasureResponse } from "./Response";
import {
  AnthropometricMeasure,
  AnthropometricMeasureRepository,
} from "../../../../../domain";
import { AnthropometricMeasureDto } from "../../../../dtos";

/**
 * @class GetAnthropometricMeasureUseCase
 * @description - The UseCase get anthropometric Measure by provided id or code or return all anthrop measure if anything is not provide
 */
export class GetAnthropometricMeasureUseCase
  implements
    UseCase<GetAnthropometricMeasureRequest, GetAnthropometricMeasureResponse>
{
  constructor(
    private readonly anthropometricMeasureRepo: AnthropometricMeasureRepository,
    private readonly mapper: ApplicationMapper<
      AnthropometricMeasure,
      AnthropometricMeasureDto
    >
  ) {}
  /**
   *
   * @param {GetAnthropometricMeasureRequest} request
   * @returns Return an array of anthropometric Measure Dto
   */
  async execute(
    request: GetAnthropometricMeasureRequest
  ): Promise<GetAnthropometricMeasureResponse> {
    try {
      const anthropometricMeasures: AnthropometricMeasure[] = [];
      if (request.id && !request.code) {
        anthropometricMeasures.push(
          await this.anthropometricMeasureRepo.getById(request.id)
        );
      } else if (request.code && !request.id) {
        const systemCode = SystemCode.create(request.code);
        if (systemCode.isFailure) return left(systemCode);
        anthropometricMeasures.push(
          await this.anthropometricMeasureRepo.getByCode(systemCode.val)
        );
      } else {
        anthropometricMeasures.push(
          ...(await this.anthropometricMeasureRepo.getAll())
        );
      }
      const measureDto = anthropometricMeasures.map(this.mapper.toResponse);
      return right(Result.ok(measureDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
