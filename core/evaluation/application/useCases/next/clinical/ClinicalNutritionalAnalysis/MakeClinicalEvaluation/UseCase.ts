import {
  Birthday,
  formatError,
  Gender,
  handleError,
  left,
  Result,
  right,
  Sex,
  UseCase,
} from "@/core/shared";
import { MakeClinicalEvaluationRequest } from "./Request";
import { MakeClinicalEvaluationResponse } from "./Response";
import {
  DataFieldResponse,
  DataFieldResponseValue,
  EvaluationContext,
  IDataFieldValidatationService,
  NextClinicalDomain,
} from "@/core/evaluation/domain";
import { DataFieldResponseDto } from "@/core/evaluation/application/dtos";
import {
  AnthroSystemCodes,
  DATA_FIELD_CODE_TYPE,
  DAY_IN_MONTHS,
} from "@/core/constants";

export class MakeClinicalEvaluationUseCase
  implements
    UseCase<MakeClinicalEvaluationRequest, MakeClinicalEvaluationResponse>
{
  constructor(
    private readonly dataFieldValidationService: IDataFieldValidatationService,
    private readonly clinicalRefRepo: NextClinicalDomain.ClinicalSignReferenceRepository,
    private readonly clinicalEvaluationService: NextClinicalDomain.IClinicalEvaluationService
  ) {}
  async execute(
    request: MakeClinicalEvaluationRequest
  ): Promise<MakeClinicalEvaluationResponse> {
    try {
      const dataFieldResponseRes = this.createDataFieldResponses(request.data);
      if (dataFieldResponseRes.isFailure) {
        return left(dataFieldResponseRes);
      }
      const dataFieldValidationResult = await this.validateDataFieldResponses(
        dataFieldResponseRes.val
      );
      if (dataFieldValidationResult.isFailure) {
        return left(dataFieldValidationResult);
      }
      const fieldObj = dataFieldResponseRes.val.reduce((acc: any, current) => {
        acc[current.getCode()] = current.getValue();
        return acc;
      }, {});
      const clinicalRefs = await this.clinicalRefRepo.getAll();
      const clinicalDataRes = [];
      for (const ref of clinicalRefs) {
        const neededDataFields = ref.getNeededDataFields();
        if (
          neededDataFields.every(field => fieldObj[field.code] != undefined)
        ) {
          clinicalDataRes.push(
            NextClinicalDomain.ClinicalData.create({
              code: ref.getCode(),
              data: neededDataFields.reduce<
                Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue>
              >((acc, current) => {
                acc[current.code] = fieldObj[current.code];
                return acc;
              }, {} as any),
            })
          );
        }
      }
      const combinedRes = Result.combine(clinicalDataRes);
      if (combinedRes.isFailure) {
        return left(combinedRes);
      }
      const contextRes = this.generateEvaluationContext(request.context);
      if (contextRes.isFailure) {
        return left(contextRes);
      }
      const evaluationRes = await this.clinicalEvaluationService.evaluate(
        clinicalDataRes.map(res => res.val),
        contextRes.val
      );
      if (evaluationRes.isFailure) {
        return left(evaluationRes);
      }
      return right(
        Result.ok(
          evaluationRes.val.map(res => ({
            code: res.code.unpack(),
            isPresent: res.isPresent,
          }))
        )
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
  private createDataFieldResponses(
    data: DataFieldResponseDto[]
  ): Result<DataFieldResponse[]> {
    try {
      const fieldsRes = data.map(field => DataFieldResponse.create(field));
      const combinedRes = Result.combine(fieldsRes);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, MakeClinicalEvaluationUseCase.name)
        );
      }
      return Result.ok(fieldsRes.map(res => res.val));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private validateDataFieldResponses(
    data: DataFieldResponse[]
  ): Promise<Result<void>> {
    return this.dataFieldValidationService.validate(data);
  }
  private generateEvaluationContext(
    context: MakeClinicalEvaluationRequest["context"]
  ): Result<EvaluationContext> {
    const birthDayRes = Birthday.create(context.birthday);
    const genderRes = Gender.create(context.sex);
    const combinedRes = Result.combine([birthDayRes, genderRes]);
    if (combinedRes.isFailure) {
      return Result.fail(
        formatError(combinedRes, MakeClinicalEvaluationUseCase.name)
      );
    }
    const ageInDays = birthDayRes.val.getAgeInDays();
    return Result.ok({
      [AnthroSystemCodes.AGE_IN_DAY]: ageInDays,
      [AnthroSystemCodes.AGE_IN_MONTH]: ageInDays / DAY_IN_MONTHS,
      [AnthroSystemCodes.SEX]: genderRes.val.sex as Sex,
    });
  }
}
