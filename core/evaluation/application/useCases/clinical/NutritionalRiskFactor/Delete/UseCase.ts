import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { DeleteNutritionalRiskFactorRequest } from "./Request";
import { DeleteNutritionalRiskFactorResponse } from "./Response";
import {
  NutritionalRiskFactor,
  NutritionalRiskFactorRepository,
} from "../../../../../domain";
import { NutritionalRiskFactorDto } from "../../../../dtos";

export class DeleteNutritionalRiskFactorUseCase
  implements
    UseCase<
      DeleteNutritionalRiskFactorRequest,
      DeleteNutritionalRiskFactorResponse
    >
{
  constructor(
    private readonly repo: NutritionalRiskFactorRepository,
    private readonly mapper: ApplicationMapper<
      NutritionalRiskFactor,
      NutritionalRiskFactorDto
    >
  ) {}
  async execute(
    request: DeleteNutritionalRiskFactorRequest
  ): Promise<DeleteNutritionalRiskFactorResponse> {
    try {
      const nutritionalRiskFactor = await this.repo.getById(request.id);
      nutritionalRiskFactor.delete();
      await this.repo.delete(request.id);
      return right(Result.ok(this.mapper.toResponse(nutritionalRiskFactor)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
