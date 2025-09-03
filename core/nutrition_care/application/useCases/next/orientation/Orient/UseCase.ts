import { handleError, left, right, UseCase, Result } from "@shared";
import { OrientRequest } from "./Request";
import { OrientResponse } from "./Response";
import { IOrientationService } from "../../../../../domain/modules/next/orientation";

export class OrientUseCase implements UseCase<OrientRequest, OrientResponse> {
  constructor(private readonly orientationService: IOrientationService) {}
  async execute(request: OrientRequest): Promise<OrientResponse> {
    try {
      const orientationResultRes = await this.orientationService.orient(request);
      if (orientationResultRes.isFailure) {
        return left(orientationResultRes);
      }

      const { code, treatmentPhase } = orientationResultRes.val;
      return right(
        Result.ok({
          code: code.unpack(),
          treatmentPhase: treatmentPhase?.unpack(),
        })
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
