import {
  ApplicationMapper,
  formatError,
  Guard,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@/core/shared";
import { GetDataFieldRefRequest } from "./Request";
import { GetDataFieldRefResponse } from "./Response";
import {
  DataFieldReference,
  DataFieldReferenceRepository,
} from "../../../../domain";
import { DataFieldReferenceDto } from "../../../dtos";

export class GetDataFieldRefUseCase
  implements UseCase<GetDataFieldRefRequest, GetDataFieldRefResponse>
{
  constructor(
    private readonly repo: DataFieldReferenceRepository,
    private readonly mapper: ApplicationMapper<
      DataFieldReference,
      DataFieldReferenceDto
    >
  ) {}
  async execute(
    request: GetDataFieldRefRequest
  ): Promise<GetDataFieldRefResponse> {
    try {
      const dataFieldRefs: DataFieldReference[] = [];
      if (request.code && !request.id) {
        const codeRes = SystemCode.create(request.code);
        if (codeRes.isFailure) return left(Result.fail(formatError(codeRes)));
        const field = await this.repo.getByCode(codeRes.val);
        dataFieldRefs.push(field);
      } else if (request.id && !request.code) {
        const field = await this.repo.getById(request.id);
        dataFieldRefs.push(field);
      } else {
        const fields = await this.repo.getAll();
        dataFieldRefs.push(...fields);
      }
      if (Guard.isEmpty(dataFieldRefs).succeeded) {
        return left(Result.fail(`DataField not found.`));
      }
      const dtos = dataFieldRefs.map(field => this.mapper.toResponse(field));
      return right(Result.ok(dtos));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
