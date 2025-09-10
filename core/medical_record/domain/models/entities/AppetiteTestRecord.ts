import {
  APPETITE_TEST_PRODUCT_TYPE,
  APPETITE_TEST_SACHET_FRACTION_PARTITION,
  DATA_FIELD_CODE_TYPE,
} from "@/core/constants";
import {
  AggregateID,
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  NegativeValueError,
  Result,
} from "@/core/shared";
import { DataFieldResponseValue } from "./DataFieldResponse";
export type TakenAmountOfPot = {
  quantity: number;
};
export type TakenAmountInSachet = {
  fraction: APPETITE_TEST_SACHET_FRACTION_PARTITION;
};
export interface IAppetiteTestRecord extends EntityPropsBaseType {
  amount: TakenAmountInSachet | TakenAmountOfPot;
  productType: APPETITE_TEST_PRODUCT_TYPE;
  fieldResponses: Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue>;
  recordAt: DomainDateTime;
}
export interface CreateAppetiteTestRecord {
  amount: TakenAmountInSachet | TakenAmountOfPot;
  productType: APPETITE_TEST_PRODUCT_TYPE;
  fieldResponses: Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue>;
  recordAt?: string;
}

export class AppetiteTestRecord extends Entity<IAppetiteTestRecord> {
  getAmount() {
    return this.props.amount;
  }
  getProductType() {
    return this.props.productType;
  }
  getRecordAt() {
    return this.props.recordAt.unpack();
  }
  getFields(): Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue> {
    return this.props.fieldResponses;
  }
  changeData(data: {
    amount: TakenAmountInSachet | TakenAmountOfPot;
    productType: APPETITE_TEST_PRODUCT_TYPE;
  }) {
    this.props.amount = data.amount;
    this.props.productType = data.productType;
    this.validate();
  }
  public validate(): void {
    this._isValid = false;
    if (this.props.productType === APPETITE_TEST_PRODUCT_TYPE.IN_SACHET) {
      if (
        Guard.isEmpty((this.props.amount as TakenAmountInSachet)?.fraction)
          .succeeded
      ) {
        throw new ArgumentInvalidException(
          "Please if the taken product is in sachet provide a product taken fraction in available options."
        );
      } else if (
        !Object.values(APPETITE_TEST_SACHET_FRACTION_PARTITION).includes(
          (this.props.amount as TakenAmountInSachet)?.fraction
        )
      ) {
        throw new ArgumentOutOfRangeException("This fraction is not supported");
      }
    }
    if (this.props.productType === APPETITE_TEST_PRODUCT_TYPE.IN_POT) {
      if (
        Guard.isEmpty((this.props.amount as TakenAmountOfPot).quantity)
          .succeeded
      ) {
        throw new ArgumentInvalidException(
          "Please if the taken product is in pot, provide the taken amount as a number"
        );
      } else if (
        Guard.isNegative((this.props.amount as TakenAmountOfPot).quantity)
          .succeeded
      ) {
        throw new NegativeValueError(
          "Please the taken amount can't be a negative number, change it and retry."
        );
      }
    }
    this._isValid = true;
  }

  static create(
    createProps: CreateAppetiteTestRecord,
    id: AggregateID
  ): Result<AppetiteTestRecord> {
    try {
      const recordedAtRes = createProps.recordAt
        ? DomainDateTime.create(createProps.recordAt)
        : DomainDateTime.create();
      if (recordedAtRes.isFailure) {
        return Result.fail(formatError(recordedAtRes));
      }
      return Result.ok(
        new AppetiteTestRecord({
          id,
          props: {
            amount: createProps.amount,
            productType: createProps.productType,
            fieldResponses: createProps.fieldResponses,
            recordAt: recordedAtRes.val,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
