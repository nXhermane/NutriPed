import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { DeleteNutritionalDiagnosticRequest } from "./Request";
import { DeleteNutritionalDiagnosticResponse } from "./Response";
import {
  NutritionalDiagnostic,
  NutritionalDiagnosticRepository,
} from "../../../../../domain";
import { NutritionalDiagnosticDto } from "../../../../dtos";

export class DeleteNutritionalDiagnosticUseCase
  implements
    UseCase<
      DeleteNutritionalDiagnosticRequest,
      DeleteNutritionalDiagnosticResponse
    >
{
  constructor(
    private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository,
    private mapper: ApplicationMapper<
      NutritionalDiagnostic,
      NutritionalDiagnosticDto
    >
  ) {}
  async execute(
    request: DeleteNutritionalDiagnosticRequest
  ): Promise<DeleteNutritionalDiagnosticResponse> {
    try {
      const nutritionalDiagnostic =
        await this.nutritionalDiagnosticRepo.getById(
          request.nutritionalDiagnosticId
        );
      nutritionalDiagnostic.delete();
      await this.nutritionalDiagnosticRepo.remove(nutritionalDiagnostic);
      return right(Result.ok(this.mapper.toResponse(nutritionalDiagnostic)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
