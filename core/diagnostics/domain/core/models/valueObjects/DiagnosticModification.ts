import {
  ArgumentInvalidException,
  DomainDate,
  EmptyStringError,
  Guard,
  handleError,
  Result,
  ValueObject,
} from "@shared";
import { NutritionalAssessmentResult } from "../entities";

export interface IDiagnosticModification {
  prevResult: NutritionalAssessmentResult;
  nextResult: NutritionalAssessmentResult;
  date: DomainDate;
  reason: string;
}

export class DiagnosticModification extends ValueObject<IDiagnosticModification> {
  protected validate(props: Readonly<IDiagnosticModification>): void {
    if (
      !props.prevResult.equals(props.nextResult) ||
      JSON.stringify(props.prevResult.getProps()) ===
        JSON.stringify(props.nextResult.getProps())
    ) {
      throw new ArgumentInvalidException(
        "The prev Diagnostic Result can't be the same with the next DiagnosticResult when you want to make a modification."
      );
    }
    if (Guard.isEmpty(props.reason).succeeded)
      throw new EmptyStringError(
        "The reason why you modify a diagnostic must be provide."
      );
  }
  static create(
    props: IDiagnosticModification
  ): Result<DiagnosticModification> {
    try {
      return Result.ok(new DiagnosticModification(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
