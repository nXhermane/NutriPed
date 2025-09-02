import { IUseCase, Result } from "@/core/shared";
import { IOrientationService } from "../../../../../domain/modules/next/orientation/ports";
import { OrientationResultDto } from "../../../../dtos/next/orientation";
import { Request } from "./Request";
import { Response } from "./Response";

export class OrientUseCase implements IUseCase<Request, Response> {
  constructor(private readonly orientationService: IOrientationService) {}

  async execute(request: Request): Promise<Response> {
    const orientationResultOrError = await this.orientationService.orient(
      request
    );

    if (orientationResultOrError.isFailure) {
      return Result.fail(orientationResultOrError.error);
    }

    const orientationResult = orientationResultOrError.getValue();

    const orientationResultDto: OrientationResultDto = {
      code: orientationResult.code.unpack(),
      treatmentPhase: orientationResult.treatmentPhase?.unpack(),
    };

    return Result.ok(orientationResultDto);
  }
}
