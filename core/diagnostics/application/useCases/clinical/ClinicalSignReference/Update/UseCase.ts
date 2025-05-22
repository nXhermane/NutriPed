import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
  ValueType,
} from "@shared";
import { UpdateClinicalSignReferenceRequest } from "./Request";
import { UpdateClinicalSignReferenceResponse } from "./Response";
import {
  ClinicalSignData,
  ClinicalSignReference,
  ClinicalSignReferenceRepository,
  Condition,
} from "../../../../../domain";
import { ClinicalSignReferenceDto } from "../../../../dtos";

export class UpdateClinicalSignReferenceUseCase
  implements
    UseCase<
      UpdateClinicalSignReferenceRequest,
      UpdateClinicalSignReferenceResponse
    >
{
  constructor(
    private readonly repo: ClinicalSignReferenceRepository,
    private readonly mapper: ApplicationMapper<
      ClinicalSignReference,
      ClinicalSignReferenceDto
    >
  ) {}
  async execute(
    request: UpdateClinicalSignReferenceRequest
  ): Promise<UpdateClinicalSignReferenceResponse> {
    try {
      const clinicalSignRef = await this.repo.getById(request.id);
      const updatedRes = this.updateClinicalSignRef(
        clinicalSignRef,
        request.data
      );
      if (updatedRes.isFailure) return left(updatedRes);
      await this.repo.save(clinicalSignRef);
      return right(Result.ok(this.mapper.toResponse(clinicalSignRef)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }

  private updateClinicalSignRef(
    clinicalSignRef: ClinicalSignReference,
    data: UpdateClinicalSignReferenceRequest["data"]
  ): Result<ValueType> {
    try {
      if (data.description) {
        clinicalSignRef.changeDesc(data.description);
      }
      if (data.name) {
        clinicalSignRef.changeName(data.name);
      }
      if (data.evaluationRule) {
        const evaluationRuleRes = Condition.create(data.evaluationRule);
        if (evaluationRuleRes.isFailure) return evaluationRuleRes;
        clinicalSignRef.changeEvaluationRule(evaluationRuleRes.val);
      }
      if (data.data) {
        const clinicalSignDataResults = data.data.map(ClinicalSignData.create);
        const combinedRes = Result.combine(clinicalSignDataResults);
        if (combinedRes.isFailure) return combinedRes;
        clinicalSignRef.changeClinicalSignData(
          clinicalSignDataResults.map(res => res.val)
        );
      }
      return Result.ok();
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
