import { AppServiceResponse, Message, UseCase } from "@/core/shared";
import {
  NormalizeAndFillDefaultDataFieldResponseRequest,
  NormalizeAndFillDefaultDataFieldResponseResponse,
  NormalizeAnthropometricDataRequest,
  NormalizeAnthropometricDataResponse,
} from "../useCases";
import { INormalizeDataAppService } from "./interfaces";
import { CreateAnthropometricData } from "../../domain";
import { DATA_FIELD_CODE_TYPE } from "@/core/constants";

export interface NormalizeDataAppServiceUseCases {
  normalizeAnthropometricDataUC: UseCase<
    NormalizeAnthropometricDataRequest,
    NormalizeAnthropometricDataResponse
  >;
  normalizeAndFillDefaultUC: UseCase<NormalizeAndFillDefaultDataFieldResponseRequest, NormalizeAndFillDefaultDataFieldResponseResponse>;
}

export class NormalizeDataAppService
  implements INormalizeDataAppService {
  constructor(
    private readonly ucs: NormalizeDataAppServiceUseCases
  ) { }
  async normalizeAnthropometricData(
    req: NormalizeAnthropometricDataRequest
  ): Promise<
    | AppServiceResponse<CreateAnthropometricData["anthropometricMeasures"]>
    | Message
  > {
    const res = await this.ucs.normalizeAnthropometricDataUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async normalizeAndFillDefault(req: NormalizeAndFillDefaultDataFieldResponseRequest): Promise<AppServiceResponse<Record<DATA_FIELD_CODE_TYPE, number | string>> | Message> {
    const res = await this.ucs.normalizeAndFillDefaultUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
