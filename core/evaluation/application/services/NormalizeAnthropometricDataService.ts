import { AppServiceResponse, Message, UseCase } from "@/core/shared";
import {
  NormalizeAnthropometricDataRequest,
  NormalizeAnthropometricDataResponse,
} from "../useCases";
import { INormalizeAnthropometricDataAppService } from "./interfaces";
import { CreateAnthropometricData } from "../../domain";

export interface NormalizeAnthropometricDataAppServiceUseCases {
  normalizeUC: UseCase<
    NormalizeAnthropometricDataRequest,
    NormalizeAnthropometricDataResponse
  >;
}

export class NormalizeAnthropometricDataAppService
  implements INormalizeAnthropometricDataAppService
{
  constructor(
    private readonly ucs: NormalizeAnthropometricDataAppServiceUseCases
  ) {}
  async normalize(
    req: NormalizeAnthropometricDataRequest
  ): Promise<
    | AppServiceResponse<CreateAnthropometricData["anthropometricMeasures"]>
    | Message
  > {
    const res = await this.ucs.normalizeUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
