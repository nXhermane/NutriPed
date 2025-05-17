import { ValueObject } from "../../common";
import { Guard, Result } from "../../../core";
import { ArgumentNotProvidedException, ArgumentInvalidException, handleError } from "../../../exceptions";
import { DomainDate } from "./Date";

export interface IDateFrame {
   start: DomainDate;
   end: DomainDate;
}
export class DateFrame extends ValueObject<IDateFrame> {
   constructor(props: IDateFrame) {
      super(props);
   }
   validate(props: IDateFrame): void {
      if (Guard.isEmpty(props.start).succeeded || Guard.isEmpty(props.end).succeeded)
         throw new ArgumentNotProvidedException("The start and end date must be provide.");
      if (!props.start.isBefore(props.end)) throw new ArgumentInvalidException("The start date must be less than end date or equal to it.");
   }

   get isExpire(): boolean {
      const date = new DomainDate();
      return this.props.end.isAfter(date);
   }

   static create(props: IDateFrame): Result<DateFrame> {
      try {
         const dateFrame = new DateFrame(props);
         return Result.ok<DateFrame>(dateFrame);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
