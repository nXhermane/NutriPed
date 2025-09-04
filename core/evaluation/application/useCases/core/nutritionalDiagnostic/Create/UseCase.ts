import {
  AggregateID,
  Factory,
  formatError,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { CreateNutritionalDiagnosticRequest } from "./Request";
import { CreateNutritionalDiagnosticResponse } from "./Response";
import {
  CreateNutritionalDiagnosticProps,
  NutritionalDiagnostic,
  NutritionalDiagnosticRepository,
  PatientACL,
  PatientInfo,
} from "../../../../../domain";

export class CreateNutritionalDiagnosticUseCase
  implements
    UseCase<
      CreateNutritionalDiagnosticRequest,
      CreateNutritionalDiagnosticResponse
    >
{
  constructor(
    private readonly nutritionalDiagnosticFactory: Factory<
      CreateNutritionalDiagnosticProps,
      NutritionalDiagnostic
    >,
    private readonly repo: NutritionalDiagnosticRepository,
    private readonly patientACL: PatientACL
  ) {}
  async execute(
    request: CreateNutritionalDiagnosticRequest
  ): Promise<CreateNutritionalDiagnosticResponse> {
    try {
      const patientInfoResult = await this.getPatientInfo(request.patientId);
      if (patientInfoResult.isFailure) return left(patientInfoResult);

      const nutritionalDiagnostic =
        await this.nutritionalDiagnosticFactory.create({
          patientId: request.patientId,
          patientDiagnosticData: {
            birthday: patientInfoResult.val.birthday.unpack(),
            sex: patientInfoResult.val.gender.unpack(),
          },
        });
      if (nutritionalDiagnostic.isFailure) return left(nutritionalDiagnostic);
      await this.repo.save(nutritionalDiagnostic.val);
      return right(Result.ok({ id: nutritionalDiagnostic.val.id }));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
  private async getPatientInfo(
    patientId: AggregateID
  ): Promise<Result<PatientInfo>> {
    try {
      const patientRes = await this.patientACL.getPatientInfo(patientId);
      if (patientRes.isFailure)
        return Result.fail(
          formatError(patientRes, CreateNutritionalDiagnosticUseCase.name)
        );

      if (patientRes.val === null)
        return Result.fail(
          "Patient Not found. Please the diagnostic must be create for an existing patient"
        );
      return Result.ok(patientRes.val);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
