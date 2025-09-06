import { AppServiceResponse, Message } from "@shared";
import {
  GetOnGoingTreatmentRequest,
} from "../../useCases/next/core/onGoingTreatment";
import { OnGoingTreatmentDto } from "../../dtos";

export interface IOnGoingTreatmentService {
  getOnGoingTreatment(
    req: GetOnGoingTreatmentRequest
  ): Promise<AppServiceResponse<OnGoingTreatmentDto> | Message>;
}
