import { Guard } from "./../../core";

import { ArgumentNotProvidedException } from "./../../exceptions";
/**
 * Domain Primitive is an object that contains only a single value
 */
export type Primitives = string | number | boolean;
export interface DomainPrimitive<T extends Primitives | Date> {
   _value: T;
}

export type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
   protected readonly props: Readonly<ValueObjectProps<T>>;

   constructor(props: ValueObjectProps<T>) {
      this.checkIfEmpty(props);
      this.validate(props);
      this.props = Object.freeze(props);
   }

   protected abstract validate(props: Readonly<ValueObjectProps<T>>): void;

   static isValueObject(obj: unknown): obj is ValueObject<unknown> {
      return obj instanceof ValueObject;
   }

   /**
    *  Check if two Value Objects are equal. Checks structural equality.
    * @param vo ValueObject
    */
   public equals(vo?: ValueObject<T>): boolean {
      if (vo === null || vo === undefined) {
         return false;
      }
      return JSON.stringify(this) === JSON.stringify(vo);
   }
   /**
    * Unpack a value object to get its raw properties
    */
   public unpack(): T {
      if (this.isDomainPrimitive(this.props)) {
         return this.props._value;
      }
      return this.props as T;
   }

   private checkIfEmpty(props: ValueObjectProps<T>): void {
      if (Guard.isEmpty(props).succeeded || (this.isDomainPrimitive(props) && Guard.isEmpty(props._value).succeeded)) {
         throw new ArgumentNotProvidedException(`[${this.constructor.name}]: The value object props must be provided.`, undefined, { props });
      }
   }

   private isDomainPrimitive(obj: unknown): obj is DomainPrimitive<T & (Primitives | Date)> {
      if (Object.prototype.hasOwnProperty.call(obj, "_value")) {
         return true;
      }
      return false;
   }
   public isValid(): boolean {
      try {
         this.validate(this.props);
         return true;
      } catch {
         return false;
      }
   }
}
