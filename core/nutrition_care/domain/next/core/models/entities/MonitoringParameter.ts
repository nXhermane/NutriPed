import {
  AggregateID,
  ArgumentInvalidException,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
} from "@/core/shared";
import {
  CreateMonitoringParameterElement,
  IMonitoringParameterElement,
  MonitoringParameterElement,
} from "../valueObjects";
import { IDuration, IFrequency } from "@/core/nutrition_care/domain/modules";

export interface IMonitoringParameter extends EntityPropsBaseType {
  startDate: DomainDateTime;
  endDate: DomainDateTime | null;
  nextTaskDate: DomainDateTime | null;
  lastExecutionDate: DomainDateTime | null;
  element: MonitoringParameterElement;
}

export interface CreateMonitoringParameter {
  startDate?: string;
  endDate: string | null;
  nextTaskDate: string | null;
  lastExecutionDate?: string | null;
  element: CreateMonitoringParameterElement;
}

export class MonitoringParameter extends Entity<IMonitoringParameter> {
  getStartDate(): string {
    return this.props.startDate.toString();
  }
  getEndDate(): string | null {
    return this.props.endDate ? this.props.endDate.toString() : null;
  }
  getNextTaskDate(): string | null {
    return this.props.nextTaskDate ? this.props.nextTaskDate.toString() : null;
  }
  getLastExecutionDate(): string | null {
    return this.props.lastExecutionDate
      ? this.props.lastExecutionDate.toString()
      : null;
  }
  getElement(): IMonitoringParameterElement {
    return this.props.element.unpack();
  }
  changeNextTaskDate(nextTaskDate: DomainDateTime | null): void {
    this.props.nextTaskDate = nextTaskDate;
    this.validate();
  }
  changeEndDate(endDate: DomainDateTime | null) {
    this.props.endDate = endDate;
    this.validate();
  }

  /**
   * Définit la prochaine date de tâche
   * Cette méthode doit être appelée par un service de domaine
   */
  setNextTaskDate(
    nextTaskDate: DomainDateTime | null,
    shouldEnd: boolean = false
  ): void {
    this.props.nextTaskDate = nextTaskDate;

    if (shouldEnd && this.props.endDate === null) {
      this.props.endDate = DomainDateTime.now();
    }

    this.validate();
  }

  /**
   * Enregistre l'exécution d'une tâche et met à jour lastExecutionDate
   */
  recordExecution(executionDate: DomainDateTime): void {
    this.props.lastExecutionDate = executionDate;
    this.validate();
  }

  /**
   * Vérifie si le paramètre est dû pour exécution à une date donnée
   */
  isDueForExecution(targetDate: DomainDateTime): boolean {
    if (!this.props.nextTaskDate) return false;
    if (this.props.endDate !== null) return false; // Déjà terminé

    return (
      targetDate.isSameDay(this.props.nextTaskDate) ||
      targetDate.isAfter(this.props.nextTaskDate)
    );
  }

  /**
   * Obtient les données nécessaires pour le calcul de la prochaine date
   */
  getDateCalculationData(): {
    startDate: DomainDateTime;
    endDate: DomainDateTime | null;
    frequency: IFrequency;
    duration: IDuration;
  } {
    const element = this.getElement();
    return {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      frequency: element.frequency.unpack(),
      duration: element.duration.unpack(),
    };
  }
  public validate(): void {
    this._isValid = false;
    if (
      Guard.isEmpty(this.props.endDate).succeeded &&
      Guard.isEmpty(this.props.nextTaskDate).succeeded
    ) {
      // NOTE: cette note puisque peut etre plus tard je comprendrai plus. Ceci est mis ici puisque si jamais la date de fin == null ce la veut dire que nous sommes dans un while in phase. Mais si jamais on termine, on peut lui attribuer une valeur ou bien mettre le status ajout. donc si jamais c'est un while in phase le nextTaskDate ne doit jamais etre null a moins que ce soit deja la fin de la phase et que le next date aussi devrait etre null
      throw new ArgumentInvalidException(
        "On monitoring parameter, when end date is empty, the next date can't be empty."
      );
    }
    if (
      this.props.nextTaskDate &&
      this.props.nextTaskDate.isBefore(this.props.startDate)
    ) {
      throw new ArgumentInvalidException(
        "On monitoring parameter, the next task date can't be before to the start date."
      );
    }

    this._isValid = true;
  }
  static create(
    createProps: CreateMonitoringParameter,
    id: AggregateID
  ): Result<MonitoringParameter> {
    try {
      const startDateRes = DomainDateTime.create(createProps.startDate);
      const endDateRes = createProps.endDate
        ? DomainDateTime.create(createProps.endDate)
        : Result.ok(null);
      const nextTaskDateRes = createProps.nextTaskDate
        ? DomainDateTime.create(createProps.nextTaskDate)
        : Result.ok(null);
      const lastExecutionDateRes = createProps.lastExecutionDate
        ? DomainDateTime.create(createProps.lastExecutionDate)
        : Result.ok(null);
      const elementRes = MonitoringParameterElement.create(createProps.element);
      const combinedRes = Result.combine([
        startDateRes,
        endDateRes,
        nextTaskDateRes,
        lastExecutionDateRes,
        elementRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, MonitoringParameter.name));
      }
      return Result.ok(
        new MonitoringParameter({
          id,
          props: {
            startDate: startDateRes.val,
            endDate: endDateRes.val,
            nextTaskDate: nextTaskDateRes.val,
            lastExecutionDate: lastExecutionDateRes.val,
            element: elementRes.val,
          },
        })
      );
    } catch (error) {
      return handleError(error);
    }
  }
}
