import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@/core/shared";
import { GetNutritionalRiskFactorRequest } from "./Request";
import { GetNutritionalRiskFactorResponse } from "./Response";
import { NextClinicalDomain } from "@/core/evaluation/domain";
import { NextClinicalDtos } from "@/core/evaluation/application/dtos";

export class GetNutritionalRiskFactorUseCase
  implements
    UseCase<GetNutritionalRiskFactorRequest, GetNutritionalRiskFactorResponse>
{
  constructor(
    private readonly nutritionalRiskFactorRepo: NextClinicalDomain.NutritionalRiskFactorRepository,
    private readonly mapper: ApplicationMapper<
      NextClinicalDomain.NutritionalRiskFactor,
      NextClinicalDtos.NutritionalRiskFactorDto
    >
  ) {}
  async execute(
    request: GetNutritionalRiskFactorRequest
  ): Promise<GetNutritionalRiskFactorResponse> {
    try {
      const riskFactors: NextClinicalDomain.NutritionalRiskFactor[] = [];
      if (request.clinicalSignCode && !request.id) {
        const codeRes = SystemCode.create(request.clinicalSignCode);
        if (codeRes.isFailure) {
          return left(codeRes);
        }
        const risks = await this.nutritionalRiskFactorRepo.getByClinicalRefCode(
          codeRes.val
        );
        riskFactors.push(...risks);
      } else if (request.id && request.clinicalSignCode) {
        const risk = await this.nutritionalRiskFactorRepo.getById(request.id);
        riskFactors.push(risk);
      } else {
        const risks = await this.nutritionalRiskFactorRepo.getAll();
        riskFactors.push(...risks);
      }

      if (riskFactors.length == 0) {
        return left(
          Result.fail("Nutritional risk not found to provided ClinicalSignCode")
        );
      }
      const dtos = riskFactors.map(risk => this.mapper.toResponse(risk));
      return right(Result.ok(dtos));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
