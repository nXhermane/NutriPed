import { ApplicationMapper, handleError, left, Result, right, UseCase } from "@shared";
import { DeleteGrowthReferenceChartRequest } from "./Request";
import { DeleteGrowthReferenceChartResponse } from "./Response";
import { GrowthReferenceChart, GrowthReferenceChartRepository } from "../../../../../domain";
import { GrowthReferenceChartDto } from "../../../../dtos";

export class DeleteGrowthReferenceChartUseCase implements UseCase<DeleteGrowthReferenceChartRequest, DeleteGrowthReferenceChartResponse> {
   constructor(
      private readonly repo: GrowthReferenceChartRepository,
      private readonly mapper: ApplicationMapper<GrowthReferenceChart, GrowthReferenceChartDto>,
   ) {}
   async execute(request: DeleteGrowthReferenceChartRequest): Promise<DeleteGrowthReferenceChartResponse> {
      try {
         const growthRefChart = await this.repo.getById(request.id);
         growthRefChart.delete();
         await this.repo.delete(request.id);
         return right(Result.ok(this.mapper.toResponse(growthRefChart)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
