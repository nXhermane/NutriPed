import { ApplicationMapper, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { GetBiochemicalReferenceRequest } from "./Request";
import { GetBiochemicalReferenceResponse } from "./Response";
import { BiochemicalReference, BiochemicalReferenceRepository } from "../../../../../domain";
import { BiochemicalReferenceDto } from "../../../../dtos";

export class GetBiochemicalReferenceUseCase implements UseCase<GetBiochemicalReferenceRequest, GetBiochemicalReferenceResponse> {
   constructor(
      private readonly repo: BiochemicalReferenceRepository,
      private readonly mapper: ApplicationMapper<BiochemicalReference, BiochemicalReferenceDto>,
   ) {}
   async execute(request: GetBiochemicalReferenceRequest): Promise<GetBiochemicalReferenceResponse> {
      try {
         const biochemicalRefs: BiochemicalReference[] = [];
         if (request.id && !request.code) {
            biochemicalRefs.push(await this.repo.getById(request.id));
         } else if (request.code && !request.id) {
            const systemCode = SystemCode.create(request.code);
            if (systemCode.isFailure) return left(systemCode);
            biochemicalRefs.push(await this.repo.getByCode(systemCode.val));
         } else {
            biochemicalRefs.push(...(await this.repo.getAll()));
         }
         return right(Result.ok(biochemicalRefs.map(this.mapper.toResponse)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
