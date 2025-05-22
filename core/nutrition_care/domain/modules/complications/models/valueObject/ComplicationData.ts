import {
  ArgumentInvalidException,
  formatError,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@shared";

export interface IComplicationData {
  code: SystemCode;
  isPresent: boolean;
}

export interface CreateComplicationDataProps {
  code: string;
  isPresent: boolean;
}

export class ComplicationData extends ValueObject<IComplicationData> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected validate(props: Readonly<IComplicationData>): void {
    if (typeof props.isPresent !== "boolean") {
      throw new ArgumentInvalidException("isPresent must be a boolean");
    }
  }
  static create(
    createProps: CreateComplicationDataProps
  ): Result<ComplicationData> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      if (codeRes.isFailure)
        return Result.fail(formatError(codeRes, ComplicationData.name));
      return Result.ok(
        new ComplicationData({
          code: codeRes.val,
          isPresent: createProps.isPresent,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
