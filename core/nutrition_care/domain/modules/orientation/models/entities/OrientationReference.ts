import {
   AggregateID,
   ArgumentNotProvidedException,
   Condition,
   EmptyStringError,
   Entity,
   EntityPropsBaseType,
   formatError,
   Guard,
   handleError,
   ICondition,
   Result,
   SystemCode,
} from "@shared";
import { AdmissionType, CreateAdmissionType, IAdmissionType } from "../valueObjects";

export interface IOrientationReference extends EntityPropsBaseType {
   name: string;
   code: SystemCode;
   admissionCriteria: Condition[];
   admissionTypes: AdmissionType[];
}

export interface CreateOrientationReferenceProps {
   name: string;
   code: string;
   admissionCriteria: ICondition[];
   admissionTypes: CreateAdmissionType[];
}

export class OrientationReference extends Entity<IOrientationReference> {
   getName(): string {
      return this.props.name;
   }
   getCode(): string {
      return this.props.code.unpack();
   }
   getAdmissionCriteria(): ICondition[] {
      return this.props.admissionCriteria.map((valObj) => valObj.unpack());
   }
   getAdmissionTypes(): IAdmissionType[] {
      return this.props.admissionTypes.map((valObj) => valObj.unpack());
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeAdmissionCriteria(admissionCriteria: Condition[]) {
      this.props.admissionCriteria = admissionCriteria;
      this.validate();
   }
   changeAdmissionTypes(admissionTypes: AdmissionType[]) {
      this.props.admissionTypes = admissionTypes;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) {
         throw new EmptyStringError("The name of orientation reference can't be empty.");
      }
      if (Guard.isEmpty(this.props.admissionCriteria).succeeded) {
         throw new ArgumentNotProvidedException("The orientation reference must have greater than zero admission criteria.");
      }
      this._isValid = true;
   }

   static create(createProps: CreateOrientationReferenceProps, id: AggregateID): Result<OrientationReference> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const admissionCriteriaRes = createProps.admissionCriteria.map(Condition.create);
         const admissionTypesRes = createProps.admissionTypes.map(AdmissionType.create);
         const combinedRes = Result.combine([codeRes, ...admissionCriteriaRes, ...admissionTypesRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, OrientationReference.name));
         const orientation = new OrientationReference({
            id,
            props: {
               name: createProps.name,
               code: codeRes.val,
               admissionCriteria: admissionCriteriaRes.map((res) => res.val),
               admissionTypes: admissionTypesRes.map((res) => res.val),
            },
         });
         return Result.ok(orientation);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
