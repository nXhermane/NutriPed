import { AppServiceResponse, Message } from "@/core/shared";
import { NormalizeAndFillDefaultDataFieldResponseRequest, NormalizeAnthropometricDataRequest } from "../../useCases";
import { CreateAnthropometricData } from "../../../domain";
import { DATA_FIELD_CODE_TYPE } from "@/core/constants";

export interface INormalizeDataAppService {
  normalizeAnthropometricData(
    req: NormalizeAnthropometricDataRequest
  ): Promise<
    | AppServiceResponse<CreateAnthropometricData["anthropometricMeasures"]>
    | Message
  >;
  normalizeAndFillDefault(req: NormalizeAndFillDefaultDataFieldResponseRequest): Promise<AppServiceResponse<Record<DATA_FIELD_CODE_TYPE, number | string>> | Message>;
}
