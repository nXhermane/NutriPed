import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
  SystemCode
} from "@shared";
import { GetMedicineRequest } from "./Request";
import { GetMedicineResponse } from "./Response";
import { NextNutritionCare } from "@/core/nutrition_care/domain";
import { NextMedicinesDto } from "@/core/nutrition_care/application/dtos";

export class GetMedicineUseCase
  implements UseCase<GetMedicineRequest, GetMedicineResponse> {
  constructor(
    private readonly repo: NextNutritionCare.MedicineRepository,
    private readonly mapper: ApplicationMapper<NextNutritionCare.Medicine, NextMedicinesDto.MedicineDto>
  ) { }
  async execute(request: GetMedicineRequest): Promise<GetMedicineResponse> {
    try {
      const medicines = await (request.code
        ? [await this.repo.getByCode(SystemCode.create(request.code).val)]
        : request.id
          ? [await this.repo.getById(request.id)]
          : await this.repo.getAll());

      return right(
        Result.ok(medicines.map(medicine => this.mapper.toResponse(medicine)))
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
