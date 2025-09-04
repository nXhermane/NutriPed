import {
  CalculateGrowthIndicatorValueUseCase,
  CalculateGrowthIndicatorValueRequest,
  GrowthIndicatorValue,
  DAY_IN_YEARS,
} from "@/core/evaluation";
import { SystemCode } from "@/core/shared";
import { MockFactory } from "@/tests/__helpers__/MockFactory";
import { AnthropometricDataBuilder } from "@/tests/__helpers__/TestBuilders";

describe("CalculateGrowthIndicatorValueUseCase", () => {
  // Mocks des services
  const mockAnthropometricValidationService = {
    validate: jest.fn(),
  };

  const mockAnthropometricVariablesService = {
    generate: jest.fn(),
  };

  const mockGrowthIndicatorService = {
    calculateIndicator: jest.fn(),
  };

  // Instance du cas d'utilisation
  let useCase: CalculateGrowthIndicatorValueUseCase;

  // Données de test
  const validRequest: CalculateGrowthIndicatorValueRequest = {
    anthropometricData: {
      anthropometricMeasures: [
        { code: "WEIGHT", value: 10, unit: "kg" },
        { code: "HEIGHT", value: 100, unit: "cm" },
      ],
    },
    indicatorCode: "BMI",
    age_in_day: 365,
    age_in_month: 12,
    sex: "M",
  };

  // Réinitialisation des mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CalculateGrowthIndicatorValueUseCase(
      mockAnthropometricValidationService,
      mockAnthropometricVariablesService,
      mockGrowthIndicatorService
    );
  });

  describe("execute", () => {
    it("should calculate growth indicator value successfully", async () => {
      // Arrange
      const anthropometricData = new AnthropometricDataBuilder()
        .withMeasures(validRequest.anthropometricData.anthropometricMeasures)
        .build();

      const validationResult = MockFactory.createSuccessResult({
        isValid: true,
        errors: [],
      });
      mockAnthropometricValidationService.validate.mockResolvedValue(
        validationResult
      );

      const anthropometricVariables = { weight: 10, height: 100 };
      const anthropometricVariablesResult = MockFactory.createSuccessResult(
        anthropometricVariables
      );
      mockAnthropometricVariablesService.generate
        .mockResolvedValueOnce(anthropometricVariablesResult)
        .mockResolvedValueOnce(anthropometricVariablesResult);

      const growthIndicatorValue = {
        code: SystemCode.create("BMI").val,
        unit: SystemCode.create("kg/m2").val,
        value: 10,
        zScore: 0,
        percentile: 50,
        unpack: () => ({
          code: SystemCode.create("BMI").val,
          unit: SystemCode.create("kg/m2").val,
          value: 10,
          zScore: 0,
          percentile: 50,
        }),
      } as GrowthIndicatorValue;

      const growthIndicatorValueResult =
        MockFactory.createSuccessResult(growthIndicatorValue);
      mockGrowthIndicatorService.calculateIndicator.mockResolvedValue(
        growthIndicatorValueResult
      );

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(result.isRight()).toBe(true);
      expect(mockAnthropometricValidationService.validate).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          age_in_day: 365,
          age_in_month: 12,
          age_in_year: 365 / DAY_IN_YEARS,
          sex: "M",
        })
      );
      expect(mockAnthropometricVariablesService.generate).toHaveBeenCalledTimes(
        2
      );
      expect(
        mockGrowthIndicatorService.calculateIndicator
      ).toHaveBeenCalledWith(anthropometricVariables, expect.any(Object));

      if (result.isRight()) {
        expect(result.value.isSuccess).toBe(true);
        if (result.value.isSuccess) {
          expect(result.value.val).toEqual({
            variables: anthropometricVariables,
            growthIndicatorValue: {
              code: "BMI",
              unit: "kg/m2",
              value: 10,
              zScore: 0,
              percentile: 50,
            },
          });
        }
      }
    });

    it("should return left when anthropometric data creation fails", async () => {
      // Arrange
      const invalidRequest: CalculateGrowthIndicatorValueRequest = {
        ...validRequest,
        anthropometricData: {
          anthropometricMeasures: [
            { code: "WEIGHT", value: -10, unit: "kg" }, // Negative value
            { code: "HEIGHT", value: 100, unit: "cm" },
          ],
        },
      };

      // Act
      const result = await useCase.execute(invalidRequest);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(
        mockAnthropometricValidationService.validate
      ).not.toHaveBeenCalled();
      expect(
        mockAnthropometricVariablesService.generate
      ).not.toHaveBeenCalled();
      expect(
        mockGrowthIndicatorService.calculateIndicator
      ).not.toHaveBeenCalled();
    });

    it("should return left when validation fails", async () => {
      // Arrange
      const validationResult =
        MockFactory.createFailureResult("Validation failed");
      mockAnthropometricValidationService.validate.mockResolvedValue(
        validationResult
      );

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(mockAnthropometricValidationService.validate).toHaveBeenCalled();
      expect(
        mockAnthropometricVariablesService.generate
      ).not.toHaveBeenCalled();
      expect(
        mockGrowthIndicatorService.calculateIndicator
      ).not.toHaveBeenCalled();
    });

    it("should return left when generating anthropometric variables fails", async () => {
      // Arrange
      const validationResult = MockFactory.createSuccessResult({
        isValid: true,
        errors: [],
      });
      mockAnthropometricValidationService.validate.mockResolvedValue(
        validationResult
      );

      const anthropometricVariablesResult = MockFactory.createFailureResult(
        "Failed to generate variables"
      );
      mockAnthropometricVariablesService.generate.mockResolvedValue(
        anthropometricVariablesResult
      );

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(mockAnthropometricValidationService.validate).toHaveBeenCalled();
      expect(mockAnthropometricVariablesService.generate).toHaveBeenCalled();
      expect(
        mockGrowthIndicatorService.calculateIndicator
      ).not.toHaveBeenCalled();
    });

    it("should return left when calculating growth indicator value fails", async () => {
      // Arrange
      const validationResult = MockFactory.createSuccessResult({
        isValid: true,
        errors: [],
      });
      mockAnthropometricValidationService.validate.mockResolvedValue(
        validationResult
      );

      const anthropometricVariables = { weight: 10, height: 100 };
      const anthropometricVariablesResult = MockFactory.createSuccessResult(
        anthropometricVariables
      );
      mockAnthropometricVariablesService.generate.mockResolvedValue(
        anthropometricVariablesResult
      );

      const growthIndicatorValueResult = MockFactory.createFailureResult(
        "Failed to calculate indicator"
      );
      mockGrowthIndicatorService.calculateIndicator.mockResolvedValue(
        growthIndicatorValueResult
      );

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(mockAnthropometricValidationService.validate).toHaveBeenCalled();
      expect(mockAnthropometricVariablesService.generate).toHaveBeenCalled();
      expect(mockGrowthIndicatorService.calculateIndicator).toHaveBeenCalled();
    });

    it("should return left when generating anthropometric variables with indicator value fails", async () => {
      // Arrange
      const validationResult = MockFactory.createSuccessResult({
        isValid: true,
        errors: [],
      });
      mockAnthropometricValidationService.validate.mockResolvedValue(
        validationResult
      );

      const anthropometricVariables = { weight: 10, height: 100 };
      const anthropometricVariablesResult = MockFactory.createSuccessResult(
        anthropometricVariables
      );
      mockAnthropometricVariablesService.generate
        .mockResolvedValueOnce(anthropometricVariablesResult)
        .mockResolvedValueOnce(
          MockFactory.createFailureResult(
            "Failed to generate variables with indicator"
          )
        );

      const growthIndicatorValue = {
        code: SystemCode.create("BMI").val,
        unit: SystemCode.create("kg/m2").val,
        value: 10,
        zScore: 0,
        percentile: 50,
        unpack: () => ({
          code: SystemCode.create("BMI").val,
          unit: SystemCode.create("kg/m2").val,
          value: 10,
          zScore: 0,
          percentile: 50,
        }),
      } as GrowthIndicatorValue;

      const growthIndicatorValueResult =
        MockFactory.createSuccessResult(growthIndicatorValue);
      mockGrowthIndicatorService.calculateIndicator.mockResolvedValue(
        growthIndicatorValueResult
      );

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(mockAnthropometricValidationService.validate).toHaveBeenCalled();
      expect(mockAnthropometricVariablesService.generate).toHaveBeenCalledTimes(
        2
      );
      expect(mockGrowthIndicatorService.calculateIndicator).toHaveBeenCalled();
    });

    it("should return left when an exception is thrown", async () => {
      // Arrange
      mockAnthropometricValidationService.validate.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      // Act
      const result = await useCase.execute(validRequest);

      // Assert
      expect(result.isLeft()).toBe(true);
      expect(mockAnthropometricValidationService.validate).toHaveBeenCalled();
    });
  });
});
