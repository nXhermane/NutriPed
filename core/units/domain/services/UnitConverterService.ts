import { Result } from "@shared";
import { Unit } from "../models";
import { IUnitConverterService } from "../ports";

export class UnitConverterService implements IUnitConverterService {
   convert(value: number, from: Unit, to: Unit): Result<number> {
      if (from.getBaseUnit() != to.getBaseUnit()) return Result.fail("It's not possible to convert a unit with different base unit.");
      const baseValue = this.convertToBase(value, from);
      return Result.ok(baseValue / to.getFactor());
   }
   convertToBase(value: number, from: Unit): number {
      return value * from.getFactor();
   }
}
