import { handleError, left, Result, right, UseCase } from "@/core/shared";
import { NormalizeAnthropometricDataRequest } from "./Request";
import { NormalizeAnthropometricDataResponse } from "./Response";
import {
  AnthropometricData,
  INormalizeAnthropometricDataService,
} from "./../../../../domain";

export class NormalizeAnthropometricDataUseCase
  implements
    UseCase<
      NormalizeAnthropometricDataRequest,
      NormalizeAnthropometricDataResponse
    >
{
  constructor(
    private readonly normalizeAnthropometricDataService: INormalizeAnthropometricDataService
  ) {}
  async execute(
    request: NormalizeAnthropometricDataRequest
  ): Promise<NormalizeAnthropometricDataResponse> {
    try {
      const anthropometricDataRes = AnthropometricData.create({
        anthropometricMeasures: request.anthropometricMeasures,
      });
      if (anthropometricDataRes.isFailure) return left(anthropometricDataRes);
      const normalizeAnthropometricDataRes =
        await this.normalizeAnthropometricDataService.normalize(
          anthropometricDataRes.val
        );
      if (normalizeAnthropometricDataRes.isFailure)
        return left(normalizeAnthropometricDataRes);
      const { entry: entries } = normalizeAnthropometricDataRes.val.unpack();
      return right(
        Result.ok(
          entries.map(entry => ({
            code: entry.code.unpack(),
            unit: entry.unit.unpack(),
            value: entry.value,
          }))
        )
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
