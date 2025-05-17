import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateUnitRequest } from "./Request";
import { CreateUnitResponse } from "./Response";
import { Unit, UnitRepository } from "../../../../domain";

export class CreateUnitUseCase implements UseCase<CreateUnitRequest, CreateUnitResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly repo: UnitRepository) {}
   async execute(request: CreateUnitRequest): Promise<CreateUnitResponse> {
      try {
         const unitId = this.idGenerator.generate().toValue();
         const unitRes = Unit.create(request.data, unitId);
         if (unitRes.isFailure) return left(unitRes);
         const exist = await this.repo.exist(unitRes.val.getProps().code);
         if (exist) return left(Result.fail("The unit with code already exist."));
         unitRes.val.created();
         await this.repo.save(unitRes.val);
         return right(Result.ok({ id: unitId }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
