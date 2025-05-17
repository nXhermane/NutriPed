import { ValueObject } from "./../../common";
import { Email } from "./Email";
import { PhoneNumber } from "./PhoneNumber";
import { Result } from "./../../../core";
import { handleError } from "./../../../exceptions";
export interface ContactProps {
   email: Email;
   phoneNumber: PhoneNumber;
}
export interface CreateContactProps {
   email: string;
   phoneNumber: string;
}
export class Contact extends ValueObject<ContactProps> {
   constructor(props: ContactProps) {
      super(props);
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   protected validate(props: ContactProps): void {
      // Validation des propriétés de contact si nécessaire
   }

   get email(): string {
      return this.props.email.unpack();
   }

   get phoneNumber(): string {
      return this.props.phoneNumber.unpack();
   }

   public toString(): string {
      return `Email: ${this.props.email.toString()}, Phone: ${this.props.phoneNumber.toString()}`;
   }
   static create(props: CreateContactProps): Result<Contact> {
      try {
         const email = Email.create(props.email);
         const phoneNumber = PhoneNumber.create(props.phoneNumber);
         const combinedResult = Result.combine([email, phoneNumber]);
         if (combinedResult.isFailure) {
            return Result.fail<Contact>(String(combinedResult.err));
         }
         const contact = new Contact({ email: email.val, phoneNumber: phoneNumber.val });
         return Result.ok<Contact>(contact);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
