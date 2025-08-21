import {
  GenerateUniqueId,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreateAppetiteTestRequest } from "./Request";
import { CreateAppetiteTestResponse } from "./Response";
import { AppetiteTestRef, AppetiteTestRefRepository } from "../../../../domain";

export class CreateAppetiteTestUseCase
  implements UseCase<CreateAppetiteTestRequest, CreateAppetiteTestResponse>
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly repo: AppetiteTestRefRepository
  ) {}
  async execute(
    request: CreateAppetiteTestRequest
  ): Promise<CreateAppetiteTestResponse> {
    try {
      const appetiteTestRes = AppetiteTestRef.create(
        { ...request.data },
        this.idGenerator.generate().toValue()
      );
      if (appetiteTestRes.isFailure) return left(appetiteTestRes);
      const exist = await this.repo.exist(appetiteTestRes.val.getProps().code);
      if (exist)
        return left(
          Result.fail(
            `The appetite test reference with this code [${appetiteTestRes.val.getCode()}] already exist.`
          )
        );
      appetiteTestRes.val.created();
      await this.repo.save(appetiteTestRes.val);
      return right(Result.ok({ id: appetiteTestRes.val.id }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
