/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppServiceResponse, Message, UseCase } from "@shared";
import { IOnGoingTreatmentService } from "../../interfaces";
import {
  GetOnGoingTreatmentRequest,
  GetOnGoingTreatmentResponse,
} from "../../../useCases/next/core/onGoingTreatment";
import { OnGoingTreatmentDto } from "../../../dtos";

export interface OnGoingTreatmentServiceUseCases {
  getOnGoingTreatmentUC: UseCase<
    GetOnGoingTreatmentRequest,
    GetOnGoingTreatmentResponse
  >;
}

export class OnGoingTreatmentService implements IOnGoingTreatmentService {
  constructor(private readonly ucs: OnGoingTreatmentServiceUseCases) {}

  async getOnGoingTreatment(
    req: GetOnGoingTreatmentRequest
  ): Promise<AppServiceResponse<OnGoingTreatmentDto> | Message> {
    const res = await this.ucs.getOnGoingTreatmentUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
