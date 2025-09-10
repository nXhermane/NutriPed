import {
  AggregateID,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";

export interface IComplicationDataRecord extends EntityPropsBaseType {
  code: SystemCode;
  isPresent: boolean;
  recordedAt: DomainDateTime;
}

export interface CreateComplicationDataRecord {
  code: string;
  isPresent: boolean;
  recordedAt?: string;
}

export class ComplicationDataRecord extends Entity<IComplicationDataRecord> {
  public validate(): void {}
  getCode(): string {
    return this.props.code.unpack();
  }
  getIsPresent(): boolean {
    return this.props.isPresent;
  }
  getRecordAt(): string {
    return this.props.recordedAt.unpack();
  }
  changeIsPresent(isPresent: boolean) {
    this.props.isPresent = isPresent;
    this.validate();
  }

  static create(
    createProps: CreateComplicationDataRecord,
    id: AggregateID
  ): Result<ComplicationDataRecord> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const recordedDateRes = createProps.recordedAt
        ? DomainDateTime.create(createProps.recordedAt)
        : DomainDateTime.create();
      const combinedRes = Result.combine([codeRes, recordedDateRes]);
      if (combinedRes.isFailure)
        return Result.fail(
          formatError(combinedRes, ComplicationDataRecord.name)
        );
      return Result.ok(
        new ComplicationDataRecord({
          id,
          props: {
            code: codeRes.val,
            isPresent: createProps.isPresent,
            recordedAt: recordedDateRes.val,
          },
        })
      );
    } catch (e) {
      return handleError(e);
    }
  }
}
