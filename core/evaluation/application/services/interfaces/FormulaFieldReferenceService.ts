import { AggregateID, AppServiceResponse, Message } from "@/core/shared";
import {
  CreateFormulaFieldRefRequest,
  GetFormulaFieldRefRequest,
} from "../../useCases";
import { FormulaFieldReferenceDto } from "../../dtos";

export interface IFormulaFieldReferenceService {
  create(
    req: CreateFormulaFieldRefRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetFormulaFieldRefRequest
  ): Promise<AppServiceResponse<FormulaFieldReferenceDto[]> | Message>;
}
