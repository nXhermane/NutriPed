import {
  AdministrationRoute,
  MEDICINE_CODES,
  MedicineCategory,
} from "@/core/constants";
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
} from "@/core/shared";
import { CreateDosageCase, DosageCase, IDosageCase } from "../valueObjects";

export interface IMedicine extends EntityPropsBaseType {
  code: SystemCode<MEDICINE_CODES>;
  name: string;
  category: MedicineCategory;
  administrationRoutes: AdministrationRoute[];
  dosageCases: DosageCase[];
  warnings: string[];
  contraindications: string[];
  interactions: string[];
  notes: string[];
}
export interface CreateMedicine {
  code: MEDICINE_CODES;
  name: string;
  category: MedicineCategory;
  administrationRoutes: AdministrationRoute[];
  dosageCases: CreateDosageCase[];
  warnings: string[];
  contraindications: string[];
  interactions: string[];
  notes: string[];
}
export class Medicine extends Entity<IMedicine> {
  getName(): string {
    return this.props.name;
  }
  getCode(): MEDICINE_CODES {
    return this.props.code.unpack();
  }
  getCategory(): MedicineCategory {
    return this.props.category;
  }
  getAdministrationRoutes(): AdministrationRoute[] {
    return this.props.administrationRoutes;
  }
  getDosageCases(): IDosageCase[] {
    return this.props.dosageCases.map(valObj => valObj.unpack());
  }
  getWarings(): string[] {
    return this.props.warnings;
  }
  getContraIndications(): string[] {
    return this.props.contraindications;
  }
  getInteractions(): string[] {
    return this.props.interactions;
  }
  getNotes(): string[] {
    return this.props.notes;
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded) {
      throw new EmptyStringError("The name of medicine can't be empty.");
    }
    if (Guard.isEmpty(this.props.administrationRoutes).succeeded) {
      throw new ArgumentNotProvidedException(
        "The administitration routes must be provide for medicine."
      );
    }
    if (Guard.isEmpty(this.props.dosageCases).succeeded) {
      throw new ArgumentNotProvidedException(
        "The dosage cases must be provided for medicine. Please provide dosage case for medicine."
      );
    }
    this._isValid = true;
  }
  static create(
    createProps: CreateMedicine,
    id: AggregateID
  ): Result<Medicine> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const dosageCasesRes = createProps.dosageCases.map(dosage =>
        DosageCase.create(dosage)
      );
      const combinedRes = Result.combine([...dosageCasesRes, codeRes]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, Medicine.name));
      }
      const medicine = new Medicine({
        id,
        props: {
          code: codeRes.val,
          name: createProps.name,
          administrationRoutes: createProps.administrationRoutes,
          dosageCases: dosageCasesRes.map(res => res.val),
          category: createProps.category,
          contraindications: createProps.contraindications,
          interactions: createProps.interactions,
          notes: createProps.notes,
          warnings: createProps.warnings,
        },
      });
      return Result.ok(medicine);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
