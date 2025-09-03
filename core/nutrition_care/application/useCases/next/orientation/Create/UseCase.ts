import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreateOrientationReferenceRequest } from "./Request";
import { CreateOrientationReferenceResponse } from "./Response";
import {
  OrientationReference,
  OrientationReferenceRepository,
} from "../../../../../domain/modules/next/orientation";

export class CreateOrientationReferenceUseCase
  implements
    UseCase<CreateOrientationReferenceRequest, CreateOrientationReferenceResponse>
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly repo: OrientationReferenceRepository
  ) {}

  async execute(
    request: CreateOrientationReferenceRequest
  ): Promise<CreateOrientationReferenceResponse> {
    try {
      const { name, code, criteria, treatmentPhase } = request;

      const orientationRefResult = OrientationReference.create(
        {
          name,
          code,
          criteria,
          treatmentPhase,
        },
        this.idGenerator.generate()
      );

      if (orientationRefResult.isFailure) {
        return left(orientationRefResult);
      }

      const exist = await this.repo.exist(orientationRefResult.val.getCode());
      if (exist) {
        return left(
          Result.fail(
            `The orientation reference with this code [${orientationRefResult.val.getCode()}] already exist.`
          )
        );
      }

      await this.repo.save(orientationRefResult.val);

      return right(Result.ok({ id: orientationRefResult.val.id }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
