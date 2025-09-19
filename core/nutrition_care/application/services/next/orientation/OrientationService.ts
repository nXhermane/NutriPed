/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IOrientationServiceNext } from "../../interfaces";
import {
  CreateOrientationReferenceRequest,
  CreateOrientationReferenceResponse,
  GetOrientationReferenceRequest,
  GetOrientationReferenceResponse,
  OrientRequest,
  OrientResponse,
  UpdateOrientationReferenceRequest,
  UpdateOrientationReferenceResponse,
} from "../../../useCases/next/orientation";

export interface OrientationServiceUseCases {
  createOrientationReferenceUC: UseCase<
    CreateOrientationReferenceRequest,
    CreateOrientationReferenceResponse
  >;
  getOrientationReferenceUC: UseCase<
    GetOrientationReferenceRequest,
    GetOrientationReferenceResponse
  >;
  orientUC: UseCase<OrientRequest, OrientResponse>;
  updateOrientationReferenceUC: UseCase<
    UpdateOrientationReferenceRequest,
    UpdateOrientationReferenceResponse
  >;
}

export class OrientationService implements IOrientationServiceNext {
  constructor(private readonly ucs: OrientationServiceUseCases) {}

  async create(
    req: CreateOrientationReferenceRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createOrientationReferenceUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(
    req: GetOrientationReferenceRequest
  ): Promise<AppServiceResponse<any[]> | Message> {
    const res = await this.ucs.getOrientationReferenceUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async orient(req: OrientRequest): Promise<AppServiceResponse<any> | Message> {
    const res = await this.ucs.orientUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async update(
    req: UpdateOrientationReferenceRequest
  ): Promise<AppServiceResponse<any> | Message> {
    const res = await this.ucs.updateOrientationReferenceUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
