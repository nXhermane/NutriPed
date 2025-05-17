import { ApplicationMapper, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { GetGrowthReferenceTableRequest } from "./Request";
import { GetGrowthReferenceTableResponse } from "./Response";
import { GrowthReferenceTable, GrowthReferenceTableRepository } from "../../../../../domain";
import { GrowthReferenceTableDto } from "../../../../dtos";

export class GetGrowthReferenceTableUseCase implements UseCase<GetGrowthReferenceTableRequest, GetGrowthReferenceTableResponse> {
   constructor(
      private readonly repo: GrowthReferenceTableRepository,
      private readonly mapper: ApplicationMapper<GrowthReferenceTable, GrowthReferenceTableDto>,
   ) {}
   async execute(request: GetGrowthReferenceTableRequest): Promise<GetGrowthReferenceTableResponse> {
      try {
         const growthRefs: GrowthReferenceTable[] = [];
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
      } catch (e) {
         return left(handleError(e));
      }
   }
}
