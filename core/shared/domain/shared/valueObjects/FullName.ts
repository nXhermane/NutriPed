import { ValueObject } from "../../common";
import { Guard, Result } from "../../../core";
import { EmptyStringError, handleError } from "../../../exceptions";
export class FullName extends ValueObject<string> {
   constructor(nom: string) {
      super({ _value: nom });
   }

   protected validate(props: { _value: string }): void {
      if (Guard.isEmpty(props._value).succeeded) {
         throw new EmptyStringError("The name must be empty.");
      }
      //TODO: Add a rule to control name length
    
   }

   get lastName(): string {
      const parts = this.props._value.trim().split(" ");
      return parts[parts.length - 1];
   }

   get firstName(): string {
      return this.props._value.trim().split(" ")[0];
   }

   get fullName(): string {
      return this.props._value;
   }

   toString(): string {
      return this.props._value;
   }
   static create(nom: string): Result<FullName> {
      try {
         const name = new FullName(nom);
         return Result.ok<FullName>(name);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
