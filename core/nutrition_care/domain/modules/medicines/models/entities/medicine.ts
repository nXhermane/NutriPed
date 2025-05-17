import {
   AggregateID,
   ArgumentNotProvidedException,
   EmptyStringError,
   Entity,
   EntityPropsBaseType,
   formatError,
   Guard,
   handleError,
   Result,
   SystemCode,
} from "@shared";
import { MedicineCategory, AdministrationRoute } from "../constants";
import { BaseDosage, DosageRange, IBaseDosage, IDosageRange } from "../valueObjects";

export interface IMedicine extends EntityPropsBaseType {
   name: string;
   code: SystemCode;
   category: MedicineCategory;
   administrationRoutes: AdministrationRoute[];
   baseDosage: BaseDosage;
   dosageRanges: DosageRange[];
   warnings: string[];
   contraindications: string[];
   interactions: string[];
   notes: string[];
}

export interface CreateMedicineProps {
   name: string;
   code: string;
   category: MedicineCategory;
   administrationRoutes: AdministrationRoute[];
   baseDosage: IBaseDosage;
   dosageRanges: IDosageRange[];
   warnings: string[];
   contraindications: string[];
   interactions: string[];
   notes: string[];
}

export class Medicine extends Entity<IMedicine> {
   getName(): string {
      return this.props.name;
   }
   getCode(): string {
      return this.props.code.unpack();
   }
   getCategory(): MedicineCategory {
      return this.props.category;
   }
   getAdministrationRoutes(): AdministrationRoute[] {
      return this.props.administrationRoutes;
   }
   getBaseDosage(): IBaseDosage {
      return this.props.baseDosage.unpack();
   }
   getDosageRanges(): IDosageRange[] {
      return this.props.dosageRanges.map((range) => range.unpack());
   }
   getWarnings(): string[] {
      return this.props.warnings;
   }
   getContraindications(): string[] {
      return this.props.contraindications;
   }
   getNotes(): string[] {
      return this.props.notes;
   }
   getInteractions(): string[] {
      return this.props.interactions;
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeCategory(category: MedicineCategory) {
      this.props.category = category;
      this.validate();
   }
   changeAdministrationRoutes(administrationRoutes: AdministrationRoute[]) {
      this.props.administrationRoutes = administrationRoutes;
      this.validate();
   }
   changeBaseDosage(baseDosage: BaseDosage) {
      this.props.baseDosage = baseDosage;
      this.validate();
   }
   changeDosageRanges(dosageRanges: DosageRange[]) {
      this.props.dosageRanges = dosageRanges;
      this.validate();
   }
   changeWarnings(warnings: string[]) {
      this.props.warnings = warnings;
      this.validate();
   }
   changeContraindications(contraindications: string[]) {
      this.props.contraindications = contraindications;
      this.validate();
   }
   changeInteractions(interactions: string[]) {
      this.props.interactions = interactions;
      this.validate();
   }
   changeNotes(notes: string[]) {
      this.props.notes = notes;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) {
         throw new EmptyStringError("The name of medicine can't be empty.");
      }
      if (Guard.isEmpty(this.props.administrationRoutes).succeeded) {
         throw new ArgumentNotProvidedException("The medicine must have an administration route.");
      }
      this._isValid = true;
   }

   static create(createProps: CreateMedicineProps, id: AggregateID): Result<Medicine> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const baseDosageRes = BaseDosage.create(createProps.baseDosage);
         const dosageRangesRes = createProps.dosageRanges.map(DosageRange.create);
         const combinedRes = Result.combine([codeRes, baseDosageRes, ...dosageRangesRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, Medicine.name));
         const medicine = new Medicine({
            id,
            props: {
               name: createProps.name,
               code: codeRes.val,
               category: createProps.category,
               baseDosage: baseDosageRes.val,
               dosageRanges: dosageRangesRes.map((res) => res.val),
               administrationRoutes: createProps.administrationRoutes,
               contraindications: createProps.contraindications,
               interactions: createProps.interactions,
               warnings: createProps.warnings,
               notes: createProps.notes,
            },
         });
         return Result.ok(medicine);
      } catch (e) {
         return handleError(e);
      }
   }
}
