import { ValueObject } from "./../../common";
import { Guard, Result } from "../../../core";
import { ArgumentNotProvidedException, handleError } from "./../../../exceptions";
export interface IAddress {
   street?: string;
   city?: string;
   postalCode?: string;
   country: string;
}

export class Address extends ValueObject<IAddress> {
   constructor(props: IAddress) {
      super(props);
   }

   protected validate(props: IAddress): void {
      if (Guard.isEmpty(props.country).succeeded) {
         throw new ArgumentNotProvidedException("Le pays de doit etre founir.");
      }
   }

   get street(): string {
      return this.props?.street || "";
   }

   get city(): string {
      return this.props?.city || "";
   }

   get postalCode(): string {
      return this.props?.postalCode || "";
   }

   get country(): string {
      return this.props.country;
   }

   getFormattedAddress(): string {
      return `${this.street}, ${this.postalCode} ${this.city}, ${this.country}`;
   }

   toString(): string {
      return this.getFormattedAddress();
   }
   static create(props: IAddress): Result<Address> {
      try {
         const address = new Address(props);
         return Result.ok<Address>(address);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
