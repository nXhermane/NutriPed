import { AnthroSystemCodes } from "@core/constants";
import {
  ArgumentOutOfRangeException,
  DomainDate,
  formatError,
  Guard,
  handleError,
  NegativeValueError,
  Result,
  SystemCode,
  UnitCode,
  ValueObject,
} from "@shared";

export enum AnthropometricDataContext {
  FOLLOW_UP = "follow_up",
  ADMISSION = "admission",
}
export interface IAnthropometricData {
  code: SystemCode;
  value: number;
  unit: UnitCode;
  recordedAt: DomainDate;
  context: AnthropometricDataContext;
}

export interface CreateAnthropometricData {
  code: string;
  value: number;
  unit: string;
  context: `${AnthropometricDataContext}`;
  recordedAt?: string;
}

export class AnthropometricData extends ValueObject<IAnthropometricData> {
  protected validate(props: Readonly<IAnthropometricData>): void {
    if (
      !Object.values(AnthroSystemCodes).includes(
        props.code.unpack() as AnthroSystemCodes
      )
    ) {
      throw new ArgumentOutOfRangeException(
        "This anthropometric measure is not supported."
      );
    }
    if (Guard.isNegative(props.value).succeeded) {
      throw new NegativeValueError(
        "The anthropometric measure value can't be negative."
      );
    }
  }
  isFollowUpContext() {
    return this.props.context == AnthropometricDataContext.FOLLOW_UP;
  }
  static create(
    createProps: CreateAnthropometricData
  ): Result<AnthropometricData> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const unitRes = UnitCode.create(createProps.unit);
      const recordedDate = createProps.recordedAt
        ? DomainDate.create(createProps.recordedAt)
        : DomainDate.create();
      const combinedRes = Result.combine([codeRes, unitRes, recordedDate]);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, AnthropometricData.name));
      return Result.ok(
        new AnthropometricData({
          code: codeRes.val,
          value: createProps.value,
          unit: unitRes.val,
          recordedAt: recordedDate.val,
          context: createProps.context as AnthropometricDataContext,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
