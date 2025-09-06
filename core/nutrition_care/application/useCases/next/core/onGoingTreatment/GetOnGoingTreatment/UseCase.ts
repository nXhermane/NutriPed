import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { GetOnGoingTreatmentRequest } from "./Request";
import { GetOnGoingTreatmentResponse } from "./Response";
import { OnGoingTreatmentRepository } from "@/core/nutrition_care/domain/next/core/ports/secondary/repositories";
import { OnGoingTreatmentDto } from "@/core/nutrition_care/application/dtos";
import { OnGoingTreatment } from "@/core/nutrition_care/domain/next";

export class GetOnGoingTreatmentUseCase
  implements
  UseCase<GetOnGoingTreatmentRequest, GetOnGoingTreatmentResponse> {
  constructor(
    private readonly onGoingTreatmentRepository: OnGoingTreatmentRepository,
    private readonly onGoingTreatmentMapper: ApplicationMapper<OnGoingTreatment,OnGoingTreatmentDto>
  ) { }

  async execute(
    request: GetOnGoingTreatmentRequest
  ): Promise<GetOnGoingTreatmentResponse> {
    try {
      const entity = await this.onGoingTreatmentRepository.getById(request.onGoingTreatmentId);
      const entityDto = this.onGoingTreatmentMapper.toResponse(entity);

      return right(Result.ok(entityDto));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
