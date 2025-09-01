import { AggregateID, AppServiceResponse, Message } from "@/core/shared";
import {
  CreateFormulaFieldReferenceRequest,
  GetFormulaFieldReferenceRequest,
} from "../../useCases";
import { FormulaFieldReferenceDto } from "../../dtos";

export interface IFormulaFieldReferenceService {
  create(
    req: CreateFormulaFieldReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetFormulaFieldReferenceRequest
  ): Promise<AppServiceResponse<FormulaFieldReferenceDto[]> | Message>;
}
