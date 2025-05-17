import { Result } from "@shared";
import { Unit } from "../../models";

export interface IUnitConverterService {
   convert(value: number, from: Unit, to: Unit): Result<number>;
   convertToBase(value: number, from: Unit): number;
}
