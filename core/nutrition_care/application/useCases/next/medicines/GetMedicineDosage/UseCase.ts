import {
  ApplicationMapper,
  handleError,
  left,
  right,
  UseCase,
} from "@shared";
import { GetMedicineDosageRequest } from "./Request";
import { GetMedicineDosageResponse } from "./Response";
import {
  IMedicationDosageCalculator,
  MedicationDosageResult,
} from "../../../../../domain/modules/next/medicines/models";
import { MedicationDosageResultDto } from "../../../../dtos/next/medicines/MedicationDosageResultDto";

export class GetMedicineDosageUseCase
  implements UseCase<GetMedicineDosageRequest, GetMedicineDosageResponse>
{
  constructor(
    private readonly calculator: IMedicationDosageCalculator,
    private readonly mapper: ApplicationMapper<
      MedicationDosageResult,
      MedicationDosageResultDto
    >
  ) {}
  async execute(
    request: GetMedicineDosageRequest
  ): Promise<GetMedicineDosageResponse> {
    try {
      const dosageRes = await this.calculator.calculate(
        request.code,
        request.context
      );
      if (dosageRes.isFailure) return left(dosageRes);

      return right(Result.ok(this.mapper.toResponse(dosageRes.val)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
