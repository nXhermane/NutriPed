import { DATA_FIELD_CODE_TYPE } from "@/core/constants";
import {
  AggregateID,
  ArgumentNotProvidedException,
  Condition,
  EmptyStringError,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  ICondition,
  Result,
  SystemCode,
} from "@/core/shared";
import { createTextarea } from "@gluestack-ui/textarea";

export interface IClinicalSignReference extends EntityPropsBaseType {
  name: string;
  code: SystemCode;
  description: string;
  rule: Condition;
  neededDataFields: {
    code: DATA_FIELD_CODE_TYPE;
    required: boolean;
  }[];
}
export interface CreateClinicalSignReference {
  name: string;
  code: string;
  rule: ICondition;
  description: string;
  neededDataFields: { code: DATA_FIELD_CODE_TYPE; required: boolean }[];
}

export class ClinicalSignReference extends Entity<IClinicalSignReference> {
  getName(): string {
    return this.props.name;
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getDescription(): string {
    return this.props.description;
  }
  getRule(): ICondition {
    return this.props.rule.unpack();
  }
  getNeededDataFields(): { code: DATA_FIELD_CODE_TYPE; required: boolean }[] {
    return this.props.neededDataFields;
  }
  changeName(name: string) {
    this.props.name = name;
    this.validate();
  }
  changeDescription(desc: string) {
    this.props.description = desc;
    this.validate();
  }
  changeDataFields(
    dataFields: { code: DATA_FIELD_CODE_TYPE; required: boolean }[]
  ) {
    this.props.neededDataFields = dataFields;
    this.validate();
  }

  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded) {
      throw new EmptyStringError(
        "The name of clinical sign reference can't be empty."
      );
    }
    if (Guard.isEmpty(this.props.description).succeeded) {
      throw new EmptyStringError(
        "The description of clinical sign reference can't be empty."
      );
    }
    if (Guard.isEmpty(this.props.neededDataFields).succeeded) {
      throw new ArgumentNotProvidedException(
        "The needed Data fields can't be emtpy."
      );
    }
    this._isValid = true;
  }
  static create(
    createProps: CreateClinicalSignReference,
    id: AggregateID
  ): Result<ClinicalSignReference> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const ruleRes = Condition.create(createProps.rule);
      const combinedRes = Result.combine([ruleRes, codeRes]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, ClinicalSignReference.name)
        );
      }
      return Result.ok(
        new ClinicalSignReference({
          id,
          props: {
            name: createProps.name,
            code: codeRes.val,
            description: createProps.description,
            rule: ruleRes.val,
            neededDataFields: createProps.neededDataFields,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
