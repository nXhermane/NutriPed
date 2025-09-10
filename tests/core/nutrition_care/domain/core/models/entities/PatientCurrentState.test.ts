import {
  PatientCurrentState,
  CreateCurrentStateProps,
} from "@/core/nutrition_care/domain/core/models/entities/PatientCurrentState";
import {
  AnthroSystemCodes,
  CLINICAL_SIGNS,
  BIOCHEMICAL_REF_CODES,
  TREATMENT_HISTORY_VARIABLES_CODES,
  COMPLICATION_CODES,
} from "@/core/constants";
import {
  APPETITE_TEST_CODES,
  APPETITE_TEST_RESULT_CODES,
} from "@/core/nutrition_care/domain/modules";
import { ConditionResult } from "smartcal";
import { DomainDate } from "@shared";

describe("PatientCurrentState", () => {
  const createProps: CreateCurrentStateProps = {
    anthropometricData: {
      [AnthroSystemCodes.WEIGHT]: 10,
    },
    clinicalSignData: {
      [CLINICAL_SIGNS.FEVER]: ConditionResult.True,
    },
    biologicalData: {
      [BIOCHEMICAL_REF_CODES.HEMOGLOBIN]: 12,
    },
    appetiteTestResult: {
      [APPETITE_TEST_CODES.CODE]: APPETITE_TEST_RESULT_CODES.PASS,
    },
    complicationData: {
      "test-complication": ConditionResult.True,
    },
    otherData: {
      [TREATMENT_HISTORY_VARIABLES_CODES.PREVIOUS_TREATMENT]:
        "ORIENTATION_HOME",
    },
  };

  it("should create a new patient current state", () => {
    // Act
    const result = PatientCurrentState.create(createProps, "state-id");

    // Assert
    expect(result.isSuccess).toBe(true);
    const state = result.val;
    expect(state.id).toBe("state-id");
    expect(state.getAnthroVariables()).toEqual({
      [AnthroSystemCodes.WEIGHT]: 10,
    });
  });

  it("should add anthropometric data", () => {
    // Arrange
    const state = PatientCurrentState.create(createProps, "state-id").val;

    // Act
    state.addAnthropometricData(AnthroSystemCodes.HEIGHT, 80, new DomainDate());

    // Assert
    expect(state.getAnthroVariables()).toEqual({
      [AnthroSystemCodes.WEIGHT]: 10,
      [AnthroSystemCodes.HEIGHT]: 80,
    });
  });

  it("should get complication variables", () => {
    // Arrange
    const state = PatientCurrentState.create(createProps, "state-id").val;

    // Act
    const complicationVars = state.getComplicationVariables();

    // Assert
    expect(complicationVars).toEqual({
      [COMPLICATION_CODES.COMPLICATIONS_NUMBER]: 1,
    });
  });
});
