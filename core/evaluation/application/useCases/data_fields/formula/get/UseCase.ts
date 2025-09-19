import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@/core/shared";
import { GetFormulaFieldReferenceResponse } from "./Response";
import { GetFormulaFieldReferenceRequest } from "./Request";
import {
  FormulaFieldReference,
  FormulaFieldRefrenceRepo,
} from "@/core/evaluation/domain";
import { FormulaFieldReferenceDto } from "@/core/evaluation/application/dtos";

export class GetFormulaFieldReferenceUseCase
  implements
    UseCase<GetFormulaFieldReferenceRequest, GetFormulaFieldReferenceResponse>
{
  constructor(
    private readonly repo: FormulaFieldRefrenceRepo,
    private readonly mapper: ApplicationMapper<
      FormulaFieldReference,
      FormulaFieldReferenceDto
    >
  ) {}

  async execute(
    request: GetFormulaFieldReferenceRequest
  ): Promise<GetFormulaFieldReferenceResponse> {
    try {
      const fields = [];
      if (request.id && !request.code) {
        const field = await this.repo.getById(request.id);
        fields.push(field);
      } else if (request.code && !request.id) {
        const codeRes = SystemCode.create(request.code);
        if (codeRes.isFailure) {
          return left(codeRes);
        }
        const field = await this.repo.getByCode(codeRes.val);
        fields.push(field);
      } else {
        const allFields = await this.repo.getAll();
        fields.push(...allFields);
      }
      const dtos = fields.map(field => this.mapper.toResponse(field));
      return right(Result.ok(dtos));
    } catch (e) {
      return left(handleError(e));
    }
  }
}
