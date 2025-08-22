import { ValueObject } from "@shared";

export interface ICareDecision {
  notes?: string[];
}

export class CareDecision extends ValueObject<ICareDecision> {
  protected validate(props: Readonly<ICareDecision>): void {
    // No validation needed for now
  }
}
