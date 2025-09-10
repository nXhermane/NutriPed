import { CARE_PHASE_CODES } from "@/core/constants";
import {
  AggregateRoot,
  BaseEntityProps,
  Criterion,
  EmptyStringError,
  EntityPropsBaseType,
  Guard,
  SystemCode,
} from "@/core/shared";

import { FollowUpAction, IFollowUpAction } from "../valueObjects";
import {
  RecommendedTreatment,
  MonitoringElement,
  IRecommendedTreatment,
  IMonitoringElement,
} from "../entities";

export interface ICarePhaseReference extends EntityPropsBaseType {
  code: SystemCode<CARE_PHASE_CODES>;
  name: string;
  description: string;
  nextPhase: SystemCode<CARE_PHASE_CODES> | undefined;
  prevPhase: SystemCode<CARE_PHASE_CODES> | undefined;
  applicabilyConditions: Criterion[];
  failureCriteria: Criterion[];
  transitionCriteria: Criterion[];
  recommendedTreatments: RecommendedTreatment[];
  monitoringPlan: MonitoringElement[];
  followUpPlan: FollowUpAction[];
}

export class CarePhaseReference extends AggregateRoot<ICarePhaseReference> {
  getCode(): CARE_PHASE_CODES {
    return this.props.code.unpack();
  }
  getName(): string {
    return this.props.name;
  }
  getDescription(): string {
    return this.props.description;
  }
  getNextPhaseCode(): CARE_PHASE_CODES | undefined {
    return this.props.nextPhase?.unpack();
  }
  getPrevPhaseCode(): CARE_PHASE_CODES | undefined {
    return this.props.prevPhase?.unpack();
  }
  getApplicabilyCondition() {
    return this.props.applicabilyConditions.map(criterion =>
      criterion.unpack()
    );
  }
  getFailureCriteria() {
    return this.props.failureCriteria.map(criteria => criteria.unpack());
  }
  getTransitionCriteria() {
    return this.props.transitionCriteria.map(criteria => criteria.unpack());
  }
  getFollowUpPlan(): IFollowUpAction[] {
    return this.props.followUpPlan.map(followUpAction =>
      followUpAction.unpack()
    );
  }
  getRecommendedTreatments(): (IRecommendedTreatment & BaseEntityProps)[] {
    return this.props.recommendedTreatments.map(treatment =>
      treatment.getProps()
    );
  }
  getMonitoringElements(): (IMonitoringElement & BaseEntityProps)[] {
    return this.props.monitoringPlan.map(el => el.getProps());
  }
  // BETA: Implements the updated before ...
  public validate(): void {
    this._isValid = false;
    if (
      Guard.isEmpty(this.props.name).succeeded ||
      Guard.isEmpty(this.props.description).succeeded
    ) {
      throw new EmptyStringError(
        "The name or description of care phase reference can't be empty. Please change it."
      );
    }
    this._isValid = true;
  }
}
