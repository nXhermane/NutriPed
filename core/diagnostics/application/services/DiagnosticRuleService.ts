/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
  CreateDiagnosticRuleRequest,
  CreateDiagnosticRuleResponse,
  GetDiagnosticRuleRequest,
  GetDiagnosticRuleResponse,
} from "../useCases";
import { IDiagnosticRuleService } from "./interfaces";
import { DiagnosticRuleDto } from "../dtos";

export interface DiagnosticRuleServiceUseCases {
  createUC: UseCase<CreateDiagnosticRuleRequest, CreateDiagnosticRuleResponse>;
  getUC: UseCase<GetDiagnosticRuleRequest, GetDiagnosticRuleResponse>;
}

export class DiagnosticRuleService implements IDiagnosticRuleService {
  constructor(private readonly ucs: DiagnosticRuleServiceUseCases) {}
  async create(
    req: CreateDiagnosticRuleRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async get(
    req: GetDiagnosticRuleRequest
  ): Promise<AppServiceResponse<DiagnosticRuleDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
