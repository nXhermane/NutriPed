import { ApplicationMapper, Guard, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { GetOrientationRefRequest } from "./Request";
import { GetOrientationRefResponse } from "./Response";
import { OrientationReference, OrientationReferenceRepository } from "../../../../domain";
import { OrientationRefDto } from "../../../dtos";

export class GetOrientationRefUseCase implements UseCase<GetOrientationRefRequest, GetOrientationRefResponse> {
   constructor(
      private readonly repo: OrientationReferenceRepository,
      private readonly mapper: ApplicationMapper<OrientationReference, OrientationRefDto>,
   ) {}
   async execute(request: GetOrientationRefRequest): Promise<GetOrientationRefResponse> {
      try {
         const orientationRefs: OrientationReference[] = [];

         if (request.orientationRefId && !request.orientationRefCode) {
            const orientationRef = await this.repo.getById(request.orientationRefId);
            orientationRefs.push(orientationRef);
         } else if (request.orientationRefCode && !request.orientationRefId) {
            const codeRes = SystemCode.create(request.orientationRefCode);
            if (codeRes.isFailure) return left(codeRes);
            const orientationRef = await this.repo.getByCode(codeRes.val);
            orientationRefs.push(orientationRef);
         } else {
            const allOrientationRefs = await this.repo.getAll();
            orientationRefs.push(...allOrientationRefs);
         }

         if (Guard.isEmpty(orientationRefs).succeeded) {
            return left(Result.fail("The Orientation Ref not found."));
         }

         return right(Result.ok(orientationRefs.map(this.mapper.toResponse)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
