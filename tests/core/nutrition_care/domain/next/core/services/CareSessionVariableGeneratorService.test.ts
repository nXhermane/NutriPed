import { CareSessionVariableGeneratorService } from "@/core/nutrition_care/domain/next/core/services/CareSessionVariableGeneratorService";
import {
  IComputedVariablePerformerACL,
  MedicalRecordVariableTransformerAcl,
} from "@/core/nutrition_care/domain/next/core/ports";
import { DomainDateTime, Result } from "@/core/shared";

describe("CareSessionVariableGeneratorService", () => {
  let computedVariablePerformerAcl: jest.Mocked<IComputedVariablePerformerACL>;
  let medicalRecordVariableTransformerAcl: jest.Mocked<MedicalRecordVariableTransformerAcl>;
  let service: CareSessionVariableGeneratorService;

  beforeEach(() => {
    computedVariablePerformerAcl = {
      computeVariables: jest.fn(),
    };
    medicalRecordVariableTransformerAcl = {
      getVariableByDate: jest.fn(),
      getConsecutiveVariable: jest.fn(),
    };
    service = new CareSessionVariableGeneratorService(
      computedVariablePerformerAcl,
      medicalRecordVariableTransformerAcl
    );
  });

  it("should generate initial variables", async () => {
    // Arrange
    const patientId = "patient-id";
    const targetDate = DomainDateTime.now();
    medicalRecordVariableTransformerAcl.getVariableByDate.mockResolvedValue(
      Result.ok({ var1: 1 })
    );

    // Act
    const result = await service.generateIntialVariables(patientId, targetDate);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.val).toEqual({ var1: 1 });
    expect(
      medicalRecordVariableTransformerAcl.getVariableByDate
    ).toHaveBeenCalledWith(patientId, targetDate);
  });
});
