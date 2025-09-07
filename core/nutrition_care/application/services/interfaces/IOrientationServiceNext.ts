import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateOrientationReferenceRequest,
  GetOrientationReferenceRequest,
  OrientRequest,
  UpdateOrientationReferenceRequest,
} from "../../useCases/next/orientation";

export interface IOrientationServiceNext {
  create(
    req: CreateOrientationReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;

  get(
    req: GetOrientationReferenceRequest
  ): Promise<AppServiceResponse<any[]> | Message>;

  orient(req: OrientRequest): Promise<AppServiceResponse<any> | Message>;

  update(
    req: UpdateOrientationReferenceRequest
  ): Promise<AppServiceResponse<void> | Message>;
}
