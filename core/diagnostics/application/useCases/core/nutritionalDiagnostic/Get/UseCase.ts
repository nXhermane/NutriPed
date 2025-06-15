import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GetNutritionalDiagnosticRequest } from "./Request";
import { GetNutritionalDiagnosticResponse } from "./Response";
import {
  NutritionalDiagnostic,
  NutritionalDiagnosticRepository,
} from "../../../../../domain";
import { NutritionalDiagnosticDto } from "../../../../dtos";

export class GetNutritionalDiagnosticUseCase
  implements
    UseCase<GetNutritionalDiagnosticRequest, GetNutritionalDiagnosticResponse>
{
  constructor(
    private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository,
    private readonly mapper: ApplicationMapper<
      NutritionalDiagnostic,
      NutritionalDiagnosticDto
    >
  ) {}
  async execute(
    request: GetNutritionalDiagnosticRequest
  ): Promise<GetNutritionalDiagnosticResponse> {
    try {
      const nutritionalDiagnostics = [];
      if (request.patientIdOrId) {
        nutritionalDiagnostics.push(
          await this.nutritionalDiagnosticRepo.getByIdOrPatientId(
            request.patientIdOrId
          )
        );
      } else {
        // CHECK: Verifier si c'est bien judicieux de le faire de la sorte ou bien de retourner tout
        nutritionalDiagnostics.push();
      }
      return right(
        Result.ok(nutritionalDiagnostics.map(nutritionalDiagnostic => this.mapper.toResponse(nutritionalDiagnostic)))
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
