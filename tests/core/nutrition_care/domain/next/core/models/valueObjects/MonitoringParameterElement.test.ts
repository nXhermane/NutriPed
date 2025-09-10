import {
  MonitoringParameterElement,
  CreateMonitoringParameterElement,
} from "@/core/nutrition_care/domain/next/core/models/valueObjects/MonitoringParameterElementData";
import {
  MONITORING_ELEMENT_CATEGORY,
  MONITORING_VALUE_SOURCE,
  AnthroSystemCodes,
  DURATION_TYPE,
  FREQUENCY_TYPE,
} from "@/core/constants";
import { Frequency, Duration } from "@/core/nutrition_care/domain/modules";
import { Result } from "@/core/shared";

jest.mock(
  "@/core/nutrition_care/domain/modules/carePhase/models/valueObjects/MonitoringFrequency"
);
jest.mock(
  "@/core/nutrition_care/domain/modules/carePhase/models/valueObjects/TreatmentDuration"
);

describe("MonitoringParameterElement", () => {
  beforeEach(() => {
    (Frequency.create as jest.Mock).mockReturnValue(Result.ok({} as Frequency));
    (Duration.create as jest.Mock).mockReturnValue(Result.ok({} as Duration));
  });

  const createProps: CreateMonitoringParameterElement = {
    id: "element-id",
    category: MONITORING_ELEMENT_CATEGORY.ANTHROPOMETRIC,
    source: MONITORING_VALUE_SOURCE.MANUAL,
    code: AnthroSystemCodes.WEIGHT,
    frequency: {
      intervalUnit: FREQUENCY_TYPE.DAILY,
      intervalValue: 1,
      countInUnit: 1,
    },
    duration: {
      type: DURATION_TYPE.DAYS,
      value: 7,
    },
  };

  it("should create a new monitoring parameter element", () => {
    // Act
    const result = MonitoringParameterElement.create(createProps);

    // Assert
    expect(result.isSuccess).toBe(true);
  });
});
