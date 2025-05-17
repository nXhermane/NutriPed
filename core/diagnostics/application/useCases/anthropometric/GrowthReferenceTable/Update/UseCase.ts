import { ApplicationMapper, handleError, left, Result, right, UseCase } from "@shared";
import { UpdateGrowthReferenceTableRequest } from "./Request";
import { UpdateGrowthReferenceTableResponse } from "./Response";
import { GrowthReferenceTable, GrowthReferenceTableRepository, TableData } from "../../../../../domain";
import { GrowthReferenceTableDto } from "../../../../dtos";

export class UpdateGrowthReferenceTableUseCase implements UseCase<UpdateGrowthReferenceTableRequest, UpdateGrowthReferenceTableResponse> {
   constructor(
      private readonly repo: GrowthReferenceTableRepository,
      private readonly mapper: ApplicationMapper<GrowthReferenceTable, GrowthReferenceTableDto>,
   ) {}
   async execute(request: UpdateGrowthReferenceTableRequest): Promise<UpdateGrowthReferenceTableResponse> {
      try {
         const growthRef = await this.repo.getById(request.id);
         const updatedRes = this.updateGrowthRef(growthRef, request.data);
         if (updatedRes.isFailure) return left(updatedRes);
         await this.repo.save(growthRef);
         return right(Result.ok(this.mapper.toResponse(growthRef)));
      } catch (e) {
         return left(handleError(e));
      }
   }

   private updateGrowthRef(growthRef: GrowthReferenceTable, data: UpdateGrowthReferenceTableRequest["data"]): Result<unknown> {
      try {
         if (data.name) {
            growthRef.changeName(data.name);
         }
         if (data.standard) {
            growthRef.changeStandard(data.standard);
         }
         if (data.data) {
            const tableData = data.data.map(TableData.create);
            const combinedRes = Result.combine(tableData);
            if (combinedRes.isFailure) return combinedRes;
            growthRef.changeTableData(tableData.map((res) => res.val));
         }
         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
