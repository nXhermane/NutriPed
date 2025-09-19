import { MilkType } from "@/core/constants";
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
} from "@/core/shared";

export interface IMilk extends EntityPropsBaseType {
  code: SystemCode<MilkType>;
  name: string;
  notes: string[];
}

export interface CreateMilk {
  code: MilkType;
  name: string;
  notes: string[];
}

export class Milk extends Entity<IMilk> {
  getCode(): MilkType {
    return this.props.code.unpack();
  }
  getName(): string {
    return this.props.name;
  }
  getNotes(): string[] {
    return this.props.notes;
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded) {
      throw new EmptyStringError("The name of milk can't be empty.");
    }
    this._isValid = true;
  }

  static create(createProps: CreateMilk, id: AggregateID): Result<Milk> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      if (codeRes.isFailure) {
        return Result.fail(formatError(codeRes, Milk.name));
      }
      return Result.ok(
        new Milk({
          id,
          props: {
            code: codeRes.val,
            name: createProps.name,
            notes: createProps.notes,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
