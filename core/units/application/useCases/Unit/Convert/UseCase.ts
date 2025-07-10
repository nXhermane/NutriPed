import {
  formatError,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { ConvertUnitRequest } from "./Request";
import { ConvertUnitResponse } from "./Response";
import { IUnitConverterService, UnitRepository } from "../../../../domain";

export class ConvertUnitUseCase
  implements UseCase<ConvertUnitRequest, ConvertUnitResponse>
{
  constructor(
    private readonly repo: UnitRepository,
    private readonly conversionService: IUnitConverterService
  ) {}
  async execute(request: ConvertUnitRequest): Promise<ConvertUnitResponse> {
    try {
      const conversionResult = request.to
        ? await this.convert(request.value, request.from, request.to)
        : await this.convertToBaseUnit(request.value, request.from);
      if (conversionResult.isFailure) return left(conversionResult);
      return right(Result.ok(conversionResult.val));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
  private async convertToBaseUnit(
    value: number,
    from: string
  ): Promise<Result<{ code: string; value: number }>> {
    try {
      const codeRes = SystemCode.create(from);
      if (codeRes.isFailure)
        return Result.fail(formatError(codeRes, ConvertUnitUseCase.name));
      const fromUnit = await this.repo.getByCode(codeRes.val);
      return Result.ok({
        value: this.conversionService.convertToBase(value, fromUnit),
        code: fromUnit.getBaseUnit(),
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async convert(
    value: number,
    from: string,
    to: string
  ): Promise<Result<{ code: string; value: number }>> {
    try {
      const fromCodeRes = SystemCode.create(from);
      const toCodeRes = SystemCode.create(to);
      const combinedRes = Result.combine([fromCodeRes, toCodeRes]);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, ConvertUnitUseCase.name));
      const fromUnit = await this.repo.getByCode(fromCodeRes.val);
      const toUnit = await this.repo.getByCode(toCodeRes.val);
      const conversionValueRes = this.conversionService.convert(
        value,
        fromUnit,
        toUnit
      );
      if (conversionValueRes.isFailure)
        return Result.fail(
          formatError(conversionValueRes, ConvertUnitUseCase.name)
        );
      return Result.ok({
        value: conversionValueRes.val,
        code: toUnit.getCode(),
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
