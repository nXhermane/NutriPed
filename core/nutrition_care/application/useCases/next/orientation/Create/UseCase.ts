import { AppService, IUseCase, Result } from "@/core/shared";
import { OrientationReference } from "../../../../../domain/modules/next/orientation/models";
import { IOrientationReferenceRepository } from "../../../../../domain/modules/next/orientation/ports";
import { OrientationReferenceMapper } from "../../../../mappers/next/orientation";
import { Request } from "./Request";
import { Response } from "./Response";

export class CreateUseCase implements IUseCase<Request, Response> {
  constructor(
    private readonly orientationRepository: IOrientationReferenceRepository,
    private readonly idGenerator: AppService.IIDGenerator
  ) {}

  async execute(request: Request): Promise<Response> {
    const id = this.idGenerator.generate();

    const orientationReferenceOrError = OrientationReference.create(
      {
        name: request.name,
        code: request.code,
        criteria: request.criteria,
        treatmentPhase: request.treatmentPhase,
      },
      id
    );

    if (orientationReferenceOrError.isFailure) {
      return Result.fail(orientationReferenceOrError.error);
    }

    const orientationReference = orientationReferenceOrError.getValue();

    await this.orientationRepository.create(orientationReference);

    const orientationReferenceDto =
      OrientationReferenceMapper.toDto(orientationReference);

    return Result.ok(orientationReferenceDto);
  }
}
