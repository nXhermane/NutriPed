import {
  AggregateID,
  EmptyStringError,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
  UnitCode,
} from "@shared";
import { IValidationRule, ValidationRule } from "../../../common";
import { ANTHROPOMETRIC_MEASURE_ERROR } from "../../errors";

export interface IAnthropometricMeasure extends EntityPropsBaseType {
  name: string;
  code: SystemCode;
  validationRules: ValidationRule[];
  availableUnit: UnitCode[];
  unit: UnitCode;
}

export interface CreateAnthropometricMeasure {
  name: string;
  code: string;
  validationRules: IValidationRule[];
  availableUnit: string[];
  unit: string;
}

export class AnthropometricMeasure extends Entity<IAnthropometricMeasure> {
  getName(): string {
    return this.props.name;
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getValidationRules(): IValidationRule[] {
    return this.props.validationRules.map(rule => rule.unpack());
  }
  getUnits(): { defaultUnit: string; availableUnits: string[] } {
    return {
      defaultUnit: this.props.unit.unpack(),
      availableUnits: this.props.availableUnit.map(unit => unit.unpack()),
    };
  }
  changeName(name: string) {
    this.props.name = name;
    this.validate();
  }
  changeUnits(units: { defaultUnit: UnitCode; availableUnits: UnitCode[] }) {
    this.props.unit = units.defaultUnit;
    this.props.availableUnit = units.availableUnits;
    this.validate();
  }
  changeValidationRules(validationRules: ValidationRule[]) {
    this.props.validationRules = validationRules;
    this.validate();
  }

  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded)
      throw new EmptyStringError(
        ANTHROPOMETRIC_MEASURE_ERROR.VALIDATION.INVALID_NAME.message
      );
    this._isValid = true;
  }

  static create(
    createProps: CreateAnthropometricMeasure,
    id: AggregateID
  ): Result<AnthropometricMeasure> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const unitRes = UnitCode.create(createProps.unit);
      const availableUnitsRes = createProps.availableUnit.map(UnitCode.create);
      const validationRulesRes = createProps.validationRules.map(
        ValidationRule.create
      );
      const combinedRes = Result.combine([
        codeRes,
        unitRes,
        ...availableUnitsRes,
        ...validationRulesRes,
      ]);
      if (combinedRes.isFailure)
        return Result.fail(
          formatError(combinedRes, AnthropometricMeasure.name)
        );
      return Result.ok(
        new AnthropometricMeasure({
          id,
          props: {
            code: codeRes.val,
            name: createProps.name,
            unit: unitRes.val,
            validationRules: validationRulesRes.map(res => res.val),
            availableUnit: availableUnitsRes.map(res => res.val),
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
