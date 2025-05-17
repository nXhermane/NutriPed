import { handleError, left, Result, right, UseCase } from "@shared";
import { OrientRequest } from "./Request";
import { OrientResponse } from "./Response";
import { IOrientationService, OrientationReferenceRepository } from "../../../../domain";

export class OrientUseCase implements UseCase<OrientRequest, OrientResponse> {
   constructor(private readonly repo: OrientationReferenceRepository, private readonly orientationService: IOrientationService) {}
   async execute(request: OrientRequest): Promise<OrientResponse> {
      try {
         const orientationRefs = await this.repo.getAll();

         const orientationResultRes = this.orientationService.orient(request, orientationRefs);
         if (orientationResultRes.isFailure) return left(orientationResultRes);

         const { name, code } = orientationResultRes.val;
         return right(Result.ok({ name, code: code.unpack() }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
