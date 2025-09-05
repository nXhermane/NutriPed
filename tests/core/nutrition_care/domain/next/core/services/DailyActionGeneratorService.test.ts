import { DailyActionGeneratorService } from "@/core/nutrition_care/domain/next/core/services/DailyActionGeneratorService";
import { GenerateUniqueId, Result } from "@/core/shared";
import { IMedicationDosageCalculator, INutritionalProductAdvisorService } from "@/core/nutrition_care/domain/modules/next";
import { OnGoingTreatment, OnGoingTreatmentRecommendation, DailyCareAction } from "@/core/nutrition_care/domain/next/core/models";
import { RECOMMENDED_TREATMENT_TYPE } from "@/core/constants";

jest.mock("@/core/nutrition_care/domain/next/core/models/entities/OnGoingTreatment");
jest.mock("@/core/nutrition_care/domain/next/core/models/valueObjects/OnGoingTreatmentRecommendation");
jest.mock("@/core/nutrition_care/domain/next/core/models/entities/DailyCareAction");

describe("DailyActionGeneratorService", () => {
    let idGenerator: jest.Mocked<GenerateUniqueId>;
    let medicineDosageService: jest.Mocked<IMedicationDosageCalculator>;
    let nutritionalProductService: jest.Mocked<INutritionalProductAdvisorService>;
    let service: DailyActionGeneratorService;

    beforeEach(() => {
        idGenerator = {
            generate: jest.fn().mockReturnValue({ toValue: () => "id" }),
        };
        medicineDosageService = {
            calculate: jest.fn(),
        };
        nutritionalProductService = {
            getDosage: jest.fn(),
        };
        service = new DailyActionGeneratorService(idGenerator, medicineDosageService, nutritionalProductService);
        (DailyCareAction.create as jest.Mock).mockReturnValue(Result.ok({} as DailyCareAction));
    });

    it("should generate daily actions", async () => {
        // Arrange
        const treatment = {
            getProps: () => ({ recommendation: { getType: () => RECOMMENDED_TREATMENT_TYPE.NUTRITIONAL, unpack: () => ({ code: "f75" }), getAdjustmentPercentage: () => 0 } }),
        } as any;
        nutritionalProductService.getDosage.mockResolvedValue(Result.ok({
            getCalculatedQuantity: () => ({} as any),
            getFeedingFrequencies: () => [],
            getRecommendedQuantity: () => ({} as any),
            getProductType: () => "f75" as any,
        }) as any);

        // Act
        const result = await service.generate(treatment, [], {});

        // Assert
        expect(result.isSuccess).toBe(true);
    });
});
