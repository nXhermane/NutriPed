import { handleError, left, Result, right, UseCase } from "@shared";
import { AddNoteToNutritionalDiagnosticRequest } from "./Request";
import { AddNoteToNutritionalDiagnosticResponse } from "./Response";
import { NutritionalDiagnosticRepository } from "../../../../../domain";

export class AddNoteToNutritionalDiagnosticUseCase
  implements
  UseCase<
    AddNoteToNutritionalDiagnosticRequest,
    AddNoteToNutritionalDiagnosticResponse
  > {
  constructor(
    private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository
  ) { }
  async execute(
    request: AddNoteToNutritionalDiagnosticRequest
  ): Promise<AddNoteToNutritionalDiagnosticResponse> {
    try {
      const nutritionalDiagnostic =
        await this.nutritionalDiagnosticRepo.getByIdOrPatientId(
          request.nutritionalDiagnosticId
        );
      nutritionalDiagnostic.addNotes(...request.notes);
      await this.nutritionalDiagnosticRepo.save(nutritionalDiagnostic);
      return right(Result.ok());
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
