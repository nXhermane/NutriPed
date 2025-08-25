import {
  ArgumentNotProvidedException,
  CreateCriterion,
  Criterion,
  formatError,
  Guard,
  handleError,
  ICriterion,
  Result,
  ValueObject,
} from "@/core/shared";
import { DosageByWeight, IDosageByWeight } from "./dosageByWeight";
import {
  ConditionalDosageFormula,
  CreateConditionalDosageFormula,
} from "./ConditionalDosageFormula";

export interface IDosageScenario {
  applicability: Criterion;
  conditionalDosageFormulas: ConditionalDosageFormula[];
  dosages: DosageByWeight[];
  isAdmissionWeight: boolean;
}

export interface CreateDosageScenario {
  applicability: CreateCriterion;
  conditionalDosageFormulas: CreateConditionalDosageFormula[];
  dosages: IDosageByWeight[];
  isAdmissionWeight: boolean;
}

export class DosageScenario extends ValueObject<IDosageScenario> {
  getCriteria(): ICriterion {
    return this.props.applicability.unpack();
  }
  getDosages(): IDosageByWeight[] {
    return this.props.dosages.map(dosage => dosage.unpack());
  }
  isAdmissionWeight(): boolean {
    return this.props.isAdmissionWeight;
  }
  protected validate(props: Readonly<IDosageScenario>): void {
    if (Guard.isEmpty(props.dosages).succeeded) {
      throw new ArgumentNotProvidedException("The dosages must be provided. ");
    }
  }
  static create(createProps: CreateDosageScenario): Result<DosageScenario> {
    try {
      const criteriaRes = Criterion.create(createProps.applicability);
      const dosageRes = createProps.dosages.map(dosage =>
        DosageByWeight.create(dosage)
      );
      const conditionalDosageFormulasRes =
        createProps.conditionalDosageFormulas.map(props =>
          ConditionalDosageFormula.create(props)
        );
      const combinedRes = Result.combine([
        criteriaRes,
        ...dosageRes,
        ...conditionalDosageFormulasRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, DosageScenario.name));
      }

      return Result.ok(
        new DosageScenario({
          applicability: criteriaRes.val,
          conditionalDosageFormulas: conditionalDosageFormulasRes.map(
            res => res.val
          ),
          dosages: dosageRes.map(res => res.val),
          isAdmissionWeight: createProps.isAdmissionWeight,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
