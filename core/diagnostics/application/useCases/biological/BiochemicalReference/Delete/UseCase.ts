import { ApplicationMapper, handleError, left, Result, right, UseCase } from "@shared";
import { DeleteBiochemicalReferenceRequest } from "./Request";
import { DeleteBiochemicalReferenceResponse } from "./Response";
import { BiochemicalReference, BiochemicalReferenceRepository } from "../../../../../domain";
import { BiochemicalReferenceDto } from "../../../../dtos";

export class DeleteBiochemicalReferenceUseCase implements UseCase<DeleteBiochemicalReferenceRequest, DeleteBiochemicalReferenceResponse> {
   constructor(
      private readonly repo: BiochemicalReferenceRepository,
      private readonly mapper: ApplicationMapper<BiochemicalReference, BiochemicalReferenceDto>,
   ) {}
   async execute(request: DeleteBiochemicalReferenceRequest): Promise<DeleteBiochemicalReferenceResponse> {
      try {
         const biochemicalRef = await this.repo.getById(request.id);
         biochemicalRef.delete();
         await this.repo.delete(request.id);
         return right(Result.ok(this.mapper.toResponse(biochemicalRef)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
