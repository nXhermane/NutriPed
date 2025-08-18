import { AppServiceResponse, Message } from "@/core/shared";
import { NormalizeAnthropometricDataRequest } from "../../useCases";
import { CreateAnthropometricData } from "../../../domain";

export interface INormalizeAnthropometricDataAppService {
  normalize(
    req: NormalizeAnthropometricDataRequest
  ): Promise<
    | AppServiceResponse<CreateAnthropometricData["anthropometricMeasures"]>
    | Message
  >;
}
