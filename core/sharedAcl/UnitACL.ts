import { UnitAcl } from "./../diagnostics";
import { handleError, Result, UnitCode } from "@shared";

import { IUnitService } from "./../units";

export class UnitACLImpl implements UnitAcl {
  constructor(private readonly unitService: IUnitService) {}

  async convertTo(
    from: UnitCode,
    to: UnitCode,
    value: number
  ): Promise<Result<number>> {
    try {
      const response = await this.unitService.convert({
        from: from.toString(),
        to: to.toString(),
        value: value,
      });

      if ("data" in response) {
        return Result.ok(response.data.value);
      }

      return Result.fail(response.content);
    } catch (error) {
      return handleError(error);
    }
  }
}
