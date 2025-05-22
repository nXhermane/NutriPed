import { ValueObject } from "@shared";

export interface ICareDecision {
  notes?: string[];
}

export class CareDecision extends ValueObject<ICareDecision> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected validate(props: Readonly<ICareDecision>): void {
    // No validation needed for now
  }
}
