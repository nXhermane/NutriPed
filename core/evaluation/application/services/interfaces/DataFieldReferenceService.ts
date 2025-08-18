import { AggregateID, AppServiceResponse, Message } from "@/core/shared";
import { CreateDataFieldRefRequest, GetDataFieldRefRequest, ValidateDataFieldResponseRequest } from "../../useCases";
import { DataFieldReferenceDto } from "../../dtos";

export interface IDataFieldReferenceService {
    create(req: CreateDataFieldRefRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>
    get(req: GetDataFieldRefRequest): Promise<AppServiceResponse<DataFieldReferenceDto[]> | Message>
    validate(req: ValidateDataFieldResponseRequest): Promise<AppServiceResponse<boolean> | Message>
}