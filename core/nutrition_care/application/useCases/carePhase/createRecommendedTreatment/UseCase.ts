import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@/core/shared";
import { CreateRecommendedTreatmentRequest } from "./Request";
import { CreateRecommendedTreatmentResponse } from "./Response";
import { RecommendedTreatment, RecommendedTreatmentRepository } from "@/core/nutrition_care/domain";

export class CreateRecommendedTreatmentUseCase implements UseCase<CreateRecommendedTreatmentRequest,CreateRecommendedTreatmentResponse> {
    constructor(private readonly idGenerator: GenerateUniqueId,private readonly repo: RecommendedTreatmentRepository) {}
   async execute(request: CreateRecommendedTreatmentRequest ):   Promise<CreateRecommendedTreatmentResponse> {
        try {
            const newId = this.idGenerator.generate().toValue();
            const recommendedTreatmentRes = RecommendedTreatment.create(request.data,newId);
            if(recommendedTreatmentRes.isFailure) {
                return left(recommendedTreatmentRes);
            }
            await this.repo.save(recommendedTreatmentRes.val);
            return right(Result.ok({id: newId}));
        } catch (e) {
            return left(handleError(e));
            
        }
    }
    
}