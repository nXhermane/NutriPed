import { Result, UnitCode } from "@shared";

export interface UnitAcl {
   convertTo(from: UnitCode, to: UnitCode, value: number): Promise<Result<number>>;
}
