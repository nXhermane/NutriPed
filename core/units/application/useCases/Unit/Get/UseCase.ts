import { ApplicationMapper, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { Unit, UnitRepository } from "../../../../domain";
import { GetUnitRequest } from "./Request";
import { GetUnitResponse } from "./Response";
import { UnitDto } from "../../../dtos";

export class GetUnitUseCase implements UseCase<GetUnitRequest, GetUnitResponse> {
   constructor(private readonly repo: UnitRepository, private readonly mapper: ApplicationMapper<Unit, UnitDto>) {}
   async execute(request: GetUnitRequest): Promise<GetUnitResponse> {
      try {
         const units: Unit[] = [];
         if (request.id && !request.code) {
            units.push(await this.repo.getById(request.id));
         } else if (request.code && !request.id) {
            const codeRes = SystemCode.create(request.code);
            if (codeRes.isFailure) return left(codeRes);
            units.push(await this.repo.getByCode(codeRes.val));
         } else {
            units.push(...(await this.repo.getAll(request.type)));
         }
         return right(Result.ok(units.map(this.mapper.toResponse)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
