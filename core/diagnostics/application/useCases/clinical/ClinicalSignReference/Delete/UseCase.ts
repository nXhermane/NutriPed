import { ApplicationMapper, handleError, left, Result, right, UseCase } from "@shared";
import { DeleteClinicalSignReferenceRequest } from "./Request";
import { DeleteClinicalSignReferenceResponse } from "./Response";
import { ClinicalSignReference, ClinicalSignReferenceRepository } from "../../../../../domain";
import { ClinicalSignReferenceDto } from "../../../../dtos";

export class DeleteClinicalSignReferenceUseCase implements UseCase<DeleteClinicalSignReferenceRequest, DeleteClinicalSignReferenceResponse> {
   constructor(
      private readonly repo: ClinicalSignReferenceRepository,
      private readonly mapper: ApplicationMapper<ClinicalSignReference, ClinicalSignReferenceDto>,
   ) {}
   async execute(request: DeleteClinicalSignReferenceRequest): Promise<DeleteClinicalSignReferenceResponse> {
      try {
         const clinicalSignRef = await this.repo.getById(request.id);
         clinicalSignRef.delete();
         await this.repo.delete(request.id);
         return right(Result.ok(this.mapper.toResponse(clinicalSignRef)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
