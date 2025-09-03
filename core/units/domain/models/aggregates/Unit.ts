import {
  AggregateID,
  AggregateRoot,
  EmptyStringError,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
} from "@shared";
import { UnitType } from "../constants";
import { UnitCreatedEvent, UnitDeletedEvent } from "../../events";

export interface IUnit extends EntityPropsBaseType {
  name: string;
  code: SystemCode;
  conversionFactor: number;
  baseUnitCode: SystemCode;
  type: UnitType;
}

export interface CreateUnitProps {
  name: string;
  code: string;
  conversionFactor: number;
  baseUnitCode: string;
  type: UnitType;
}

export class Unit extends AggregateRoot<IUnit> {
  getName(): string {
    return this.props.name;
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getBaseUnit(): string {
    return this.props.baseUnitCode.unpack();
  }
  getFactor(): number {
    return this.props.conversionFactor;
  }
  getType(): UnitType {
    return this.props.type;
  }
  changeName(name: string) {
    this.props.name = name;
    this.validate();
  }
  changeCode(code: SystemCode) {
    this.props.code = code;
    this.validate();
  }
  changeBaseUnitAndFactor(unit: { factor: number; baseUnit: SystemCode }) {
    this.props.conversionFactor = unit.factor;
    this.props.baseUnitCode = unit.baseUnit;
    this.validate();
  }
  changeType(type: UnitType) {
    this.props.type = type;
    this.validate();
  }
  override created(): void {
    this.addDomainEvent(
      new UnitCreatedEvent({
        id: this.id,
        code: this.getCode(),
        baseUnit: this.getBaseUnit(),
        factor: this.getFactor(),
        name: this.getName(),
      })
    );
  }
  override delete(): void {
    this.addDomainEvent(
      new UnitDeletedEvent({ id: this.id, code: this.getCode() })
    );
    super.delete();
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded)
      throw new EmptyStringError("The unit name can't be empty.");
    this._isValid = true;
  }
  static create(createProps: CreateUnitProps, id: AggregateID): Result<Unit> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const baseUnitRes = SystemCode.create(createProps.baseUnitCode);
      const combinedRes = Result.combine([codeRes, baseUnitRes]);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, Unit.name));
      const unit = new Unit({
        id,
        props: {
          name: createProps.name,
          code: codeRes.val,
          baseUnitCode: baseUnitRes.val,
          conversionFactor: createProps.conversionFactor,
          type: createProps.type,
        },
      });
      unit.created();
      return Result.ok(unit);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
