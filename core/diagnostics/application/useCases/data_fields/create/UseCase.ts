import { GenerateUniqueId, handleError, left, Result, right, UseCase } from "@/core/shared";
import { CreateDataFieldRefRequest } from "./Request";
import { CreateDataFieldRefResponse } from "./Response";
import { CreateDataFieldReference, DataFieldReference, DataFieldReferenceRepository } from "./../../../../domain";

export class CreateDataFieldRefUseCase implements UseCase<CreateDataFieldRefRequest, CreateDataFieldRefResponse> {
    constructor(private readonly generateId: GenerateUniqueId, private readonly repo: DataFieldReferenceRepository) { }
    async execute(request: CreateDataFieldReference): Promise<CreateDataFieldRefResponse> {
        try {
            const newFieldId = this.generateId.generate().toValue()
            const fieldRefRes = DataFieldReference.create(request, newFieldId)
            if (fieldRefRes.isFailure) return left(fieldRefRes)
            fieldRefRes.val.created()
            await this.repo.save(fieldRefRes.val)
            return right(Result.ok({ id: newFieldId }))
        } catch (e: unknown) {
            return left(handleError(e))
        }
    }
}