import {
  ApplicationMapper,
  Guard,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@/core/shared";
import { GetClinicalSignReferenceRequest } from "./Request";
import { GetClinicalSignReferenceResponse } from "./Response";
import { NextClinicalDomain } from "@/core/evaluation/domain";
import { NextClinicalDtos } from "@/core/evaluation/application/dtos";

export class GetClinicalSignReferenceUseCase
  implements
    UseCase<GetClinicalSignReferenceRequest, GetClinicalSignReferenceResponse>
{
  constructor(
    private readonly repo: NextClinicalDomain.ClinicalSignReferenceRepository,
    private readonly mapper: ApplicationMapper<
      NextClinicalDomain.ClinicalSignReference,
      NextClinicalDtos.ClinicalSignReferenceDto
    >
  ) {}
  async execute(
    request: GetClinicalSignReferenceRequest
  ): Promise<GetClinicalSignReferenceResponse> {
    try {
      const clinicalRefs: NextClinicalDomain.ClinicalSignReference[] = [];
      if (request.code && !request.id) {
        const codeRes = SystemCode.create(request.code);
        if (codeRes.isFailure) {
          return left(codeRes);
        }
        const ref = await this.repo.getByCode(codeRes.val);
        clinicalRefs.push(ref);
      } else if (request.id && !request.code) {
        const ref = await this.repo.getById(request.id);
        clinicalRefs.push(ref);
      } else {
        const refs = await this.repo.getAll();
        clinicalRefs.push(...refs);
      }
      if (Guard.isEmpty(clinicalRefs).succeeded) {
        return left(Result.fail("Clinical sign reference not found on repo."));
      }
      const clinicalDtos = clinicalRefs.map(ref => this.mapper.toResponse(ref));
      return right(Result.ok(clinicalDtos));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
