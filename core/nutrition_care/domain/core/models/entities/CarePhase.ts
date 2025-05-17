import { AggregateID, EmptyStringError, Entity, EntityPropsBaseType, Guard, handleError, Result } from "@shared";

export interface ICarePhase extends EntityPropsBaseType {
   name: string;
}
export class CarePhase extends Entity<ICarePhase> {
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) {
         throw new EmptyStringError("CarePhase name can't be empty.");
      }
      this._isValid = true;
   }
   static create(props: ICarePhase, id: AggregateID): Result<CarePhase> {
      try {
         return Result.ok(new CarePhase({ props, id }));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
