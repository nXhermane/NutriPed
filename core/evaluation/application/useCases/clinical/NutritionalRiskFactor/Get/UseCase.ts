import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { GetNutritionalRiskFactorRequest } from "./Request";
import { GetNutritionalRiskFactorResponse } from "./Response";
import {
  NutritionalRiskFactor,
  NutritionalRiskFactorRepository,
} from "../../../../../domain";
import { NutritionalRiskFactorDto } from "../../../../dtos";

export class GetNutritionalRiskFactorUseCase
  implements
    UseCase<GetNutritionalRiskFactorRequest, GetNutritionalRiskFactorResponse>
{
  constructor(
    private readonly repo: NutritionalRiskFactorRepository,
    private readonly mapper: ApplicationMapper<
      NutritionalRiskFactor,
      NutritionalRiskFactorDto
    >
  ) {}
  async execute(
    request: GetNutritionalRiskFactorRequest
  ): Promise<GetNutritionalRiskFactorResponse> {
    try {
      const nutritionalRiskFactors: NutritionalRiskFactor[] = [];
      if (request.id && !request.clinicalSignRefCode) {
        nutritionalRiskFactors.push(await this.repo.getById(request.id));
      } else if (request.clinicalSignRefCode && !request.id) {
        const systemCode = SystemCode.create(request.clinicalSignRefCode);
        if (systemCode.isFailure) return left(systemCode);
        nutritionalRiskFactors.push(
          ...(await this.repo.getByClinicalRefCode(systemCode.val))
        );
      } else {
        nutritionalRiskFactors.push(...(await this.repo.getAll()));
      }
      return right(
        Result.ok(nutritionalRiskFactors.map(this.mapper.toResponse))
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
