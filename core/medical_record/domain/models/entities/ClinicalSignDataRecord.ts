import { CLINICAL_SIGNS } from "@/core/constants";
import {
  AggregateID,
  ArgumentOutOfRangeException,
  DomainDate,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";

export interface IClinicalSignDataRecord extends EntityPropsBaseType {
  code: SystemCode;
  data: { [key: string]: any };
  isPresent: boolean;
  recordedAt: DomainDate;
}

export interface CreateClinicalSignDataRecord {
  code: string;
  data: {
    [key: string]: any;
  };
  isPresent: boolean;
  recordedAt?: string;
}

export class ClinicalSingDataRecord extends Entity<IClinicalSignDataRecord> {
  public validate(): void {
    if (
      !Object.values(CLINICAL_SIGNS).includes(this.props.code.unpack() as any)
    ) {
      throw new ArgumentOutOfRangeException(
        "The clinical Sign is not supported."
      );
    }
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getData(): object {
    return this.props.data;
  }
  getIsPresent(): boolean {
    return this.props.isPresent;
  }
  getRecordAt(): string {
    return this.props.recordedAt.unpack();
  }
  changeData(data: object) {
    this.props.data = data;
    this.validate();
  }
  changeIsPresent(isPresent: boolean) {
    this.props.isPresent = isPresent;
    this.validate();
  }
  static create(
    createProps: CreateClinicalSignDataRecord,
    id: AggregateID
  ): Result<ClinicalSingDataRecord> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const recordedAt = createProps.recordedAt
        ? DomainDate.create(createProps.recordedAt)
        : DomainDate.create();
      if (codeRes.isFailure)
        return Result.fail(formatError(codeRes, ClinicalSingDataRecord.name));
      return Result.ok(
        new ClinicalSingDataRecord({
          id,
          props: {
            code: codeRes.val,
            data: createProps.data,
            recordedAt: recordedAt.val,
            isPresent: createProps.isPresent,
          },
        })
      );
    } catch (e) {
      return handleError(e);
    }
  }
}
