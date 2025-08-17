import { ApplicationMapper, formatError, handleError, left, Result, SystemCode, UseCase } from "@/core/shared";
import { GetDataFieldRefRequest } from "./Request";
import { GetDataFieldRefResponse } from "./Response";
import { DataFieldReference, DataFieldReferenceRepository } from "./../../../../domain";
import { DataFieldReferenceDto } from "../../../dtos";

export class GetDataFieldRefUseCase implements UseCase<GetDataFieldRefRequest, GetDataFieldRefResponse> {
    constructor(private readonly repo: DataFieldReferenceRepository, private readonly mapper: ApplicationMapper<DataFieldReference, DataFieldReferenceDto>
    ) { }
    async execute(request: GetDataFieldRefRequest): Promise<GetDataFieldRefResponse> {
        try {
            const dataFieldRefs: DataFieldReference[] = []
            if (request.code && !request.id) {
                const codeRes = SystemCode.create(request.code)
                if (codeRes.isFailure) return left(Result.fail(formatError(codeRes)))
                const fields = await this.repo.getByCode(codeRes.val)
                dataFieldRefs.push(fields)
            }
        } catch (e: unknown) {
            return left(handleError(e))
        }
    }
}