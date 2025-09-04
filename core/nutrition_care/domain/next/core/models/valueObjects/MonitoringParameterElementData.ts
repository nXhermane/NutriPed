import {
  AnthroSystemCodes,
  BIOCHEMICAL_REF_CODES,
  CLINICAL_SIGNS,
  DATA_FIELD_CODE_TYPE,
  MONITORING_ELEMENT_CATEGORY,
  MONITORING_VALUE_SOURCE,
} from "@/core/constants";
import {
  Duration,
  Frequency,
  IDuration,
  IFrequency,
} from "@/core/nutrition_care/domain/modules";
import {
  AggregateID,
  formatError,
  Guard,
  handleError,
  InvalidReference,
  Result,
  SystemCode,
  ValueObject,
} from "@/core/shared";
import { ValueOf } from "@/utils";

export interface IMonitoringParameterElement {
  id: AggregateID;
  category: MONITORING_ELEMENT_CATEGORY;
  source: MONITORING_VALUE_SOURCE;
  code: SystemCode<
    | AnthroSystemCodes
    | ValueOf<typeof BIOCHEMICAL_REF_CODES>
    | DATA_FIELD_CODE_TYPE
    | ValueOf<typeof CLINICAL_SIGNS>
  >;
  frequency: Frequency;
  duration: Duration;
}
export interface CreateMonitoringParameterElement {
  id: AggregateID;
  category: MONITORING_ELEMENT_CATEGORY;
  source: MONITORING_VALUE_SOURCE;
  code:
    | AnthroSystemCodes
    | ValueOf<typeof BIOCHEMICAL_REF_CODES>
    | ValueOf<typeof CLINICAL_SIGNS>
    | DATA_FIELD_CODE_TYPE;
  frequency: IFrequency;
  duration: IDuration;
}

export class MonitoringParameterElement extends ValueObject<IMonitoringParameterElement> {
  getId(): AggregateID {
    return this.props.id;
  }
  getCode():
    | AnthroSystemCodes
    | ValueOf<typeof BIOCHEMICAL_REF_CODES>
    | ValueOf<typeof CLINICAL_SIGNS>
    | DATA_FIELD_CODE_TYPE {
    return this.props.code.unpack();
  }
  getFrequency(): IFrequency {
    return this.props.frequency.unpack();
  }
  getDuration(): IDuration {
    return this.props.duration.unpack();
  }
  getCategory(): MONITORING_ELEMENT_CATEGORY {
    return this.props.category;
  }
  getSource(): MONITORING_VALUE_SOURCE {
    return this.props.source;
  }
  protected validate(props: Readonly<IMonitoringParameterElement>): void {
    if (Guard.isEmpty(props.id).succeeded) {
      throw new InvalidReference(
        "MonitoringParameterElement ID cannot be empty"
      );
    }
  }
  static create(
    createProps: CreateMonitoringParameterElement
  ): Result<MonitoringParameterElement> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const frequencyRes = Frequency.create(createProps.frequency);
      const durationRes = Duration.create(createProps.duration);
      const combinedRes = Result.combine([codeRes, frequencyRes, durationRes]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, MonitoringParameterElement.name)
        );
      }
      const element = new MonitoringParameterElement({
        id: createProps.id,
        code: codeRes.val,
        category: createProps.category,
        source: createProps.source,
        duration: durationRes.val,
        frequency: frequencyRes.val,
      });
      return Result.ok(element);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
