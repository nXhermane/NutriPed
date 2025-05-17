import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CreateOrientationRefRequest } from "./Request";
import { CreateOrientationRefResponse } from "./Response";
import { OrientationReference, OrientationReferenceRepository } from "../../../../domain";

export class CreateOrientationRefUseCase implements UseCase<CreateOrientationRefRequest, CreateOrientationRefResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly repo: OrientationReferenceRepository) {}
   async execute(request: CreateOrientationRefRequest): Promise<CreateOrientationRefResponse> {
      try {
         const newId = this.idGenerator.generate().toValue();
         const orientationRefRes = OrientationReference.create(request.data, newId);
         if (orientationRefRes.isFailure) return left(orientationRefRes);

         const orientationRef = orientationRefRes.val;
         const exist = await this.repo.exist(orientationRef.getProps().code);
         if (exist) return left(Result.fail(`The orientationRef with this code [${orientationRef.getCode()}] already exist.`));

         orientationRef.created();
         await this.repo.save(orientationRef);
         return right(Result.ok({ id: newId }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
