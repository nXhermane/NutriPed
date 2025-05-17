import { ApplicationMapper, handleError, left, Result, right, Sex, UseCase } from "@shared";
import { UpdateGrowthReferenceChartRequest } from "./Request";
import { UpdateGrowthReferenceChartResponse } from "./Response";
import { ChartData, GrowthReferenceChart, GrowthReferenceChartRepository } from "../../../../../domain";
import { GrowthReferenceChartDto } from "../../../../dtos";

export class UpdateGrowthReferenceChartUseCase implements UseCase<UpdateGrowthReferenceChartRequest, UpdateGrowthReferenceChartResponse> {
   constructor(
      private readonly repo: GrowthReferenceChartRepository,
      private readonly mapper: ApplicationMapper<GrowthReferenceChart, GrowthReferenceChartDto>,
   ) {}
   async execute(request: UpdateGrowthReferenceChartRequest): Promise<UpdateGrowthReferenceChartResponse> {
      try {
         const growthRef = await this.repo.getById(request.id);
         const updatedRes = this.updateGrowthRef(growthRef, request.data);
         if (updatedRes.isFailure) return left(updatedRes);
         await this.repo.save(growthRef);
         return right(Result.ok(this.mapper.toResponse(growthRef)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   private updateGrowthRef(growthRef: GrowthReferenceChart, data: UpdateGrowthReferenceChartRequest["data"]): Result<unknown> {
      try {
         if (data.sex) {
            growthRef.changeSex(data.sex as Sex);
         }
         if (data.name) {
            growthRef.changeName(data.name);
         }
         if (data.standard) {
            growthRef.changeStandard(data.standard);
         }
         if (data.data) {
            const chartData = data.data.map(ChartData.create);
            const combinedRes = Result.combine(chartData);
            if (combinedRes.isFailure) return combinedRes;
            growthRef.changeData(chartData.map((res) => res.val));
         }
         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
