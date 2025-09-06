import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
  SystemCode,
  Guard,
} from "@shared";
import { GetMedicineRequest } from "./Request";
import { GetMedicineResponse } from "./Response";
import { NextNutritionCare } from "@/core/nutrition_care/domain";
import { NextMedicinesDto } from "@/core/nutrition_care/application/dtos";

export class GetMedicineUseCase
  implements UseCase<GetMedicineRequest, GetMedicineResponse>
{
  constructor(
    private readonly repo: NextNutritionCare.MedicineRepository,
    private readonly mapper: ApplicationMapper<
      NextNutritionCare.Medicine,
      NextMedicinesDto.MedicineDto
    >
  ) {}
  async execute(request: GetMedicineRequest): Promise<GetMedicineResponse> {
    try {
      const medicines = [];
      if(request.code && !request.id) {
        const codeRes = SystemCode.create(request.code);
        if(codeRes.isFailure) {
          return left(codeRes);
        }
        const medicine = await this.repo.getByCode(codeRes.val)
        medicines.push(medicine);
      }else if (request.id && !request.code) {
        const medicine = await this.repo.getById(request.id);
        medicines.push(medicine);
      }else {
        medicines.push(...await this.repo.getAll());
      }
      if(Guard.isEmpty(medicines).succeeded) {
        return left(Result.fail("The medicines not found."));
      }
      return right(
        Result.ok(medicines.map(medicine => this.mapper.toResponse(medicine)))
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
