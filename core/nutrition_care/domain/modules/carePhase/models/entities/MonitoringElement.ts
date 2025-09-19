import {
  AnthroSystemCodes,
  BIOCHEMICAL_REF_CODES,
  CLINICAL_SIGNS,
  DATA_FIELD_CODE_TYPE,
  MONITORING_ELEMENT_CATEGORY,
  MONITORING_VALUE_SOURCE,
} from "@/core/constants";
import {
  AggregateID,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";
import { ValueOf } from "@/utils";
import { IFrequency, Frequency, Duration, IDuration } from "../valueObjects";
export type MONITORING_CODE_TYPE =
  | AnthroSystemCodes
  | ValueOf<typeof BIOCHEMICAL_REF_CODES>
  | DATA_FIELD_CODE_TYPE
  | ValueOf<typeof CLINICAL_SIGNS>;
export interface IMonitoringElement extends EntityPropsBaseType {
  category: MONITORING_ELEMENT_CATEGORY;
  source: MONITORING_VALUE_SOURCE;
  code: SystemCode<MONITORING_CODE_TYPE>;
  frequency: Frequency;
  duration: Duration;
}

export interface CreateMonitoringElement {
  category: MONITORING_ELEMENT_CATEGORY;
  source: MONITORING_VALUE_SOURCE;
  code: MONITORING_CODE_TYPE;
  frequency: IFrequency;
  duration: IDuration;
}

export class MonitoringElement extends Entity<IMonitoringElement> {
  getCategory(): MONITORING_ELEMENT_CATEGORY {
    return this.props.category;
  }
  getSource(): MONITORING_VALUE_SOURCE {
    return this.props.source;
  }
  getCode(): MONITORING_CODE_TYPE {
    return this.props.code.unpack();
  }
  getFrequency(): IFrequency {
    return this.props.frequency.unpack();
  }
  getDuration(): IDuration {
    return this.props.duration.unpack();
  }
  // BETA: laisser les methods d'update d'abord...
  validate(): void {
    this._isValid = false;
    // Implement the validation rule here if need it...
    this._isValid = true;
  }
  static create(
    createProps: CreateMonitoringElement,
    id: AggregateID
  ): Result<MonitoringElement> {
    try {
      const frequencyRes = Frequency.create(createProps.frequency);
      const durationRes = Duration.create(createProps.duration);
      const codeRes = SystemCode.create(createProps.code);
      const combinedRes = Result.combine([codeRes, frequencyRes, durationRes]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, MonitoringElement.name));
      }
      return Result.ok(
        new MonitoringElement({
          id,
          props: {
            category: createProps.category,
            code: codeRes.val,
            frequency: frequencyRes.val,
            duration: durationRes.val,
            source: createProps.source,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
