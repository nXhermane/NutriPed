import { ApplicationMapper, handleError, left, Result, right, UseCase } from "@shared";
import { DeleteGrowthReferenceTableRequest } from "./Request";
import { DeleteGrowthReferenceTableResponse } from "./Response";
import { GrowthReferenceTable, GrowthReferenceTableRepository } from "../../../../../domain";
import { GrowthReferenceTableDto } from "../../../../dtos";

export class DeleteGrowthReferenceTableUseCase implements UseCase<DeleteGrowthReferenceTableRequest, DeleteGrowthReferenceTableResponse> {
   constructor(
      private readonly mapper: ApplicationMapper<GrowthReferenceTable, GrowthReferenceTableDto>,
      private readonly repo: GrowthReferenceTableRepository,
   ) {}
   async execute(request: DeleteGrowthReferenceTableRequest): Promise<DeleteGrowthReferenceTableResponse> {
      try {
         const growthRefTable = await this.repo.getById(request.id);
         const growthRefTableDto = this.mapper.toResponse(growthRefTable);
         growthRefTable.delete();
         await this.repo.delete(request.id);
         return right(Result.ok(growthRefTableDto));
      } catch (e) {
         return left(handleError(e));
      }
   }
}
