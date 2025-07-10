import { ValueObject } from "./../../common";
import { Guard, Result } from "./../../../core";
import {
  ArgumentNotProvidedException,
  handleError,
} from "./../../../exceptions";
// TODO: Il faut que je prend en charge la validation par injection d'un service qui va essayer de valider le PhoneNumber
export class PhoneNumber extends ValueObject<string> {
  constructor(number: string) {
    super({ _value: number });
  }

  protected validate(props: { _value: string }): void {
    if (Guard.isEmpty(props._value).succeeded) {
      throw new ArgumentNotProvidedException(
        "Le numéro de téléphone ne peut pas être vide."
      );
    }
  }

  public isValidFormat(): boolean {
    // Expression régulière pour valider un numéro de téléphone au format XXX-XXX-XXXX ou XXXXXXXXXX
    const phoneNumberRegex = /^(\d{3}-\d{3}-\d{4}|\d{10})$/;
    return phoneNumberRegex.test(this.props._value);
  }

  public getAreaCode(): string {
    // Récupérer le code de zone du numéro de téléphone
    const areaCode = this.props._value.replace(/\D/g, "").slice(0, 3);
    return areaCode;
  }

  public getFormattedNumber(): string {
    // Formater le numéro de téléphone en XXX-XXX-XXXX
    const digits = this.props._value.replace(/\D/g, "");
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  public toString(): string {
    return this.props._value;
  }
  static create(number: string): Result<PhoneNumber> {
    try {
      const tel = new PhoneNumber(number);
      return Result.ok<PhoneNumber>(tel);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
