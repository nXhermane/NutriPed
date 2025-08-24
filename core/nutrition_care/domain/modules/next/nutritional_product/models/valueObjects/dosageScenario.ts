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

export interface IDosageScenario {
  applicability: Criterion;
  dosages: DosageByWeight[];
}

export interface CreateDosageScenario {
  applicability: CreateCriterion;
  dosages: IDosageByWeight[];
}

export class DosageScenario extends ValueObject<IDosageScenario> {
  getCriteria(): ICriterion {
    return this.props.applicability.unpack();
  }
  getDosages(): IDosageByWeight[] {
    return this.props.dosages.map(dosage => dosage.unpack());
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
      const combinedRes = Result.combine([criteriaRes, ...dosageRes]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, DosageScenario.name));
      }

      return Result.ok(
        new DosageScenario({
          applicability: criteriaRes.val,
          dosages: dosageRes.map(res => res.val),
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
