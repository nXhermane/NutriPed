import { DataFieldCategory, FieldDataType } from "@/core/constants";
import {
  AggregateID,
  ArgumentInvalidException,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
  EmptyStringError,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
  UnitCode,
} from "@/core/shared";

export interface IDataFieldReference extends EntityPropsBaseType {
  code: SystemCode;
  label: string;
  question: string;
  category: DataFieldCategory;
  type: FieldDataType;
  range?: [number, number];
  enum?: { label: string; value: string }[];
  units?: { default: UnitCode; available: UnitCode[] };
  defaultValue: any;
}
export interface CreateDataFieldReference {
  code: string;
  label: string;
  question: string;
  category: DataFieldCategory;
  type: FieldDataType;
  dataRange?: [number, number];
  enumValue?: { label: string; value: string }[];
  units?: { default: string; available: string[] };
  defaultValue: any;
}

export class DataFieldReference extends Entity<IDataFieldReference> {
  getLabel(): string {
    return this.props.label;
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getQuestion(): string {
    return this.props.question;
  }
  getCategory(): DataFieldCategory {
    return this.props.category;
  }
  getType(): FieldDataType {
    return this.props.type;
  }
  getValue(): any {
    return this.props.defaultValue;
  }
  getRange(): [number, number] | undefined {
    return this.props.range;
  }
  getEnum(): { label: string; value: string }[] | undefined {
    return this.props.enum;
  }
  getUnits(): { default: string; available: string[] } | undefined {
    if (this.props.units) {
      return {
        default: this.props.units.default.unpack(),
        available: this.props.units.available.map(unit => unit.unpack()),
      };
    }
    return undefined;
  }
  changeLabel(label: string) {
    this.props.label = label;
    this.validate();
  }
  changeQuestion(question: string) {
    this.props.question = question;
    this.validate();
  }
  changeData(data: {
    type: FieldDataType;
    category: DataFieldCategory;
    enum?: { label: string; value: string }[];
    range?: [number, number];
    units?: {
      default: UnitCode;
      available: UnitCode[];
    };
  }) {
    this.props.type = data.type;
    this.props.category = data.category;
    if (data.enum) {
      this.props.enum = data.enum;
    }
    if (data.range) {
      this.props.range = data.range;
    }
    if (data.units) {
      this.props.units = data.units;
    }
    this.validate();
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.label).succeeded) {
      throw new EmptyStringError("The label of DataField can't be empty.");
    }
    if (Guard.isEmpty(this.props.question).succeeded) {
      throw new EmptyStringError("The asking on DataField can't be empty.");
    }
    switch (this.props.type) {
      case FieldDataType.ENUM:
        {
          if (Guard.isEmpty(this.props.enum).succeeded) {
            throw new ArgumentNotProvidedException(
              "The enumValue can't be emtpy if the type of DataField is an Enum."
            );
          }
          const enumValueContaintDefaultValue = this.props.enum?.some(
            enumItem => enumItem === this.props.defaultValue
          );
          if (!enumValueContaintDefaultValue) {
            throw new ArgumentNotProvidedException(
              "La valeur par defaut d'un DataField de type enum doit etre contnue dans les options possible pour l'enum."
            );
          }
        }
        break;

      case FieldDataType.RANGE:
        {
          if (Guard.isEmpty(this.props.range).succeeded) {
            throw new ArgumentNotProvidedException(
              "The range of Ranged DataField can't be empty."
            );
          }
          if (
            !Guard.inRange(
              this.props.defaultValue,
              this.props.range?.[0] as number,
              this.props.range?.[1] as number,
              "range"
            ).succeeded
          ) {
            throw new ArgumentOutOfRangeException(
              "The default value of Ranged DataField must be in interval of provided range."
            );
          }
        }
        break;
      case FieldDataType.QUANTITY:
        {
          if (Guard.isEmpty(this.props.units).succeeded) {
            throw new ArgumentNotProvidedException(
              "The quantity dataField must be containt on untis props.Please provided it."
            );
          }
          const availableUnits = this.props.units?.available;
          const defaultUnit = this.props.units?.default;
          const isContaintInAvailableUnits = !!availableUnits?.find(unit =>
            unit.equals(defaultUnit)
          );
          if (!isContaintInAvailableUnits) {
            throw new ArgumentInvalidException(
              "The defaults units must be containt in availables units."
            );
          }
          if (!Guard.isNumber(this.props.defaultValue).succeeded) {
            throw new ArgumentInvalidException(
              "The provided default value is not valide because the Quantity DataField can't be accepts other value different to number. "
            );
          }
        }
        break;
      case FieldDataType.BOOL:
        {
          if (typeof this.props.defaultValue != "boolean") {
            throw new ArgumentInvalidException(
              "The boolean data Field default value can't be other than true / false"
            );
          }
        }
        break;
      case FieldDataType.INT:
        {
          if (!Guard.isNumber(this.props.defaultValue).succeeded) {
            throw new ArgumentInvalidException(
              "The integer DataField can't be accepts other value than a number."
            );
          }
        }
        break;
      case FieldDataType.STR:
        {
          if (typeof this.props.defaultValue != "string") {
            throw new ArgumentInvalidException(
              "The string DataField can't accepts other value than string."
            );
          }
        }
        break;
      default: {
        throw new ArgumentOutOfRangeException(
          "The provided Datafield Type is not supported !"
        );
      }
    }

    this._isValid = true;
  }

  static create(
    createProps: CreateDataFieldReference,
    id: AggregateID
  ): Result<DataFieldReference> {
    try {
      let units:
        | undefined
        | {
            default: UnitCode;
            available: UnitCode[];
          } = undefined;
      const codeRes = SystemCode.create(createProps.code);
      if (codeRes.isFailure) {
        return Result.fail(formatError(codeRes, DataFieldReference.name));
      }
      if (createProps.units) {
        const availableUnitRes = createProps.units.available.map(unit =>
          UnitCode.create(unit)
        );
        const defaultUnitsRes = UnitCode.create(createProps.units.default);
        const combinedRes = Result.combine([
          ...availableUnitRes,
          defaultUnitsRes,
        ]);
        if (combinedRes.isFailure) {
          return Result.fail(formatError(combinedRes, DataFieldReference.name));
        }
        units = {
          default: defaultUnitsRes.val,
          available: availableUnitRes.map(res => res.val),
        };
      }
      return Result.ok(
        new DataFieldReference({
          id,
          props: {
            category: createProps.category,
            type: createProps.type,
            code: codeRes.val,
            defaultValue: createProps.defaultValue,
            label: createProps.label,
            question: createProps.question,
            enum: createProps.enumValue,
            range: createProps.dataRange,
            units: units,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
