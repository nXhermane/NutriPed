import { ApplicationMapper, IUseCase, Result } from "@/core/shared";
import { IOrientationReferenceRepository } from "../../../../../domain/modules/next/orientation/ports";
import { OrientationReference } from "../../../../../domain/modules/next/orientation/models";
import { OrientationReferenceDto } from "../../../../dtos/next/orientation";
import { Request } from "./Request";
import { Response } from "./Response";

export class GetUseCase implements IUseCase<Request, Response> {
  constructor(
    private readonly orientationRepository: IOrientationReferenceRepository,
    private readonly orientationMapper: ApplicationMapper<
      OrientationReference,
      OrientationReferenceDto
    >
  ) {}

  async execute(request: Request): Promise<Response> {
    const getAllResult = await this.orientationRepository.getAll();

    if (getAllResult.isFailure) {
      return Result.fail(getAllResult.error);
    }

    const orientationReferences = getAllResult.getValue();

    const orientationReferenceDtos = orientationReferences.map((ref) =>
      this.orientationMapper.toDto(ref)
    );

    return Result.ok(orientationReferenceDtos);
  }
}
