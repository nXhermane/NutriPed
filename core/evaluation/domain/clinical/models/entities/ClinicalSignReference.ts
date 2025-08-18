/**
 * @fileoverview ClinicalSignReference entity represents a reference definition for clinical signs
 * used in nutritional assessment.
 *
 * @class ClinicalSignReference
 * @extends Entity<IClinicalSignReference>
 *
 * Properties:
 * - name: Human readable name of the clinical sign
 * - code: Unique identifier code for the sign
 * - description: Detailed description of the sign
 * - evaluationRule: Logic for evaluating presence of the sign
 * - data: Associated measurement data points
 */

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
} from "@shared";
import {
  ClinicalSignData,
  CreateClinicalSignData,
  IClinicalSignData,
} from "../valueObjects";
import { Condition, ICondition } from "../../../common";

export interface IClinicalSignReference extends EntityPropsBaseType {
  name: string;
  code: SystemCode;
  description: string;
  evaluationRule: Condition;
  data: ClinicalSignData[];
}

export interface CreateClinicalSignReference {
  name: string;
  code: string;
  description: string;
  evaluationRule: ICondition;
  data: CreateClinicalSignData[];
}

export class ClinicalSignReference extends Entity<IClinicalSignReference> {
  getName(): string {
    return this.props.name;
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getDesc(): string {
    return this.props.description;
  }
  getRule(): ICondition {
    return this.props.evaluationRule.unpack();
  }
  getClinicalSignData(): IClinicalSignData[] {
    return this.props.data.map(signData => signData.unpack());
  }
  changeName(name: string) {
    this.props.name = name;
    this.validate();
  }
  changeDesc(desc: string) {
    this.props.description = desc;
    this.validate();
  }
  changeEvaluationRule(condition: Condition) {
    this.props.evaluationRule = condition;
    this.validate();
  }
  changeClinicalSignData(data: ClinicalSignData[]) {
    this.props.data = data;
    this.validate();
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded) {
      throw new EmptyStringError(
        "The name of ClinicalSignReference can't be empty."
      );
    }
    if (Guard.isEmpty(this.props.description).succeeded) {
      throw new EmptyStringError(
        "The description of ClinicalSignReference must be provide and can't be empty."
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
      const evaluationRuleRes = Condition.create(createProps.evaluationRule);
      const clinicalSignDataRes = createProps.data.map(ClinicalSignData.create);
      const combinedRes = Result.combine([
        codeRes,
        evaluationRuleRes,
        ...clinicalSignDataRes,
      ]);
      if (combinedRes.isFailure)
        return Result.fail(
          formatError(combinedRes, ClinicalSignReference.name)
        );
      return Result.ok(
        new ClinicalSignReference({
          id,
          props: {
            code: codeRes.val,
            name: createProps.name,
            description: createProps.description,
            evaluationRule: evaluationRuleRes.val,
            data: clinicalSignDataRes.map(res => res.val),
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
