import { TREATMENT_DURATION_TYPE } from "@/core/constants";
import {
  Guard,
  handleError,
  NegativeValueError,
  Result,
  ValueObject,
} from "@/core/shared";

export interface ITreatmentDuration {
  /**
   * 'days': Le traitement dure un nombre de jours défini.
   * 'hours': Le traitement dure un nombre d'heures défini.
   * 'while_in_phase': Le traitement est actif tant que le patient est dans cette phase.
   */
  type: TREATMENT_DURATION_TYPE;
  /** La valeur numérique de la durée (ex: 5 pour 5 jours). */
  value?: number;
}

export class TreatmentDuration extends ValueObject<ITreatmentDuration> {
  getType() {
    return this.props.type;
  }
  getValue() {
    return this.props.value;
  }
  protected validate(props: Readonly<ITreatmentDuration>): void {
    if (props.value && Guard.isNegative(props.value).succeeded) {
      throw new NegativeValueError(
        "The value props on treatment duration can't be negative if it provided."
      );
    }
  }
  static create(props: ITreatmentDuration): Result<TreatmentDuration> {
    try {
      return Result.ok(new TreatmentDuration(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
