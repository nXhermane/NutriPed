import {
  formatError,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { UpdateUnitRequest } from "./Request";
import { UpdateUnitResponse } from "./Response";
import { Unit, UnitRepository } from "../../../../domain";

export class UpdateUnitUseCase
  implements UseCase<UpdateUnitRequest, UpdateUnitResponse>
{
  constructor(private readonly repo: UnitRepository) {}
  async execute(request: UpdateUnitRequest): Promise<UpdateUnitResponse> {
    try {
      const unit = await this.repo.getById(request.id);
      const updatedRes = this.updateUnit(unit, request.data);
      if (updatedRes.isFailure) return left(updatedRes);
      await this.repo.save(unit);
      return right(Result.ok());
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
  private updateUnit(
    unit: Unit,
    data: UpdateUnitRequest["data"]
  ): Result<void> {
    try {
      if (data.name) {
        unit.changeName(data.name);
      }
      if (data.baseUnitCode && data.conversionFactor) {
        const baseCode = SystemCode.create(data.baseUnitCode);
        if (baseCode.isFailure)
          return Result.fail(formatError(baseCode, UpdateUnitUseCase.name));
        unit.changeBaseUnitAndFactor({
          factor: data.conversionFactor,
          baseUnit: baseCode.val,
        });
      }
      if (data.type) {
        unit.changeType(data.type);
      }
      return Result.ok();
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
