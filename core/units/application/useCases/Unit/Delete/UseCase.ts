import { handleError, left, Result, right, UseCase } from "@shared";
import { DeleteUnitRequest } from "./Request";
import { DeleteUnitResponse } from "./Response";
import { UnitRepository } from "../../../../domain";

export class DeleteUnitUseCase implements UseCase<DeleteUnitRequest, DeleteUnitResponse> {
   constructor(private readonly repo: UnitRepository) {}
   async execute(request: DeleteUnitRequest): Promise<DeleteUnitResponse> {
      try {
         const unit = await this.repo.getById(request.id);
         unit.delete();
         await this.repo.remove(unit);
         return right(Result.ok());
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
