import { ApplicationMapper, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { GetGrowthReferenceChartRequest } from "./Request";
import { GetGrowthReferenceChartResponse } from "./Response";
import { GrowthReferenceChart, GrowthReferenceChartRepository } from "../../../../../domain";
import { GrowthReferenceChartDto } from "../../../../dtos";

export class GetGrowthReferenceChartUseCase implements UseCase<GetGrowthReferenceChartRequest, GetGrowthReferenceChartResponse> {
   constructor(
      private readonly repo: GrowthReferenceChartRepository,
      private readonly mapper: ApplicationMapper<GrowthReferenceChart, GrowthReferenceChartDto>,
   ) {}
   async execute(request: GetGrowthReferenceChartRequest): Promise<GetGrowthReferenceChartResponse> {
      try {
         const growthRefs: GrowthReferenceChart[] = [];
         if (request.id && !request.code) {
            growthRefs.push(await this.repo.getById(request.id));
         } else if (request.code && !request.id) {
            const systemCode = SystemCode.create(request.code);
            if (systemCode.isFailure) return left(systemCode);
            growthRefs.push(await this.repo.getByCode(systemCode.val));
         } else {
            growthRefs.push(...(await this.repo.getAll()));
         }

         return right(Result.ok(growthRefs.map(this.mapper.toResponse)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
