import { ApplicationMapper, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { GetClinicalSignReferenceRequest } from "./Request";
import { GetClinicalSignReferenceResponse } from "./Response";
import { ClinicalSignReference, ClinicalSignReferenceRepository } from "../../../../../domain";
import { ClinicalSignReferenceDto } from "../../../../dtos";

export class GetClinicalSignReferenceUseCase implements UseCase<GetClinicalSignReferenceRequest, GetClinicalSignReferenceResponse> {
   constructor(
      private readonly repo: ClinicalSignReferenceRepository,
      private readonly mapper: ApplicationMapper<ClinicalSignReference, ClinicalSignReferenceDto>,
   ) {}
   async execute(request: GetClinicalSignReferenceRequest): Promise<GetClinicalSignReferenceResponse> {
      try {
         const clinicalSignRefs: ClinicalSignReference[] = [];
         if (request.id && !request.code) {
            clinicalSignRefs.push(await this.repo.getById(request.id));
         } else if (request.code && !request.id) {
            const systemCode = SystemCode.create(request.code);
            if (systemCode.isFailure) return left(systemCode);
            clinicalSignRefs.push(await this.repo.getByCode(systemCode.val));
         } else {
            clinicalSignRefs.push(...(await this.repo.getAll()));
         }
         return right(Result.ok(clinicalSignRefs.map(this.mapper.toResponse)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
