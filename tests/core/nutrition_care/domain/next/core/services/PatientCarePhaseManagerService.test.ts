import { CarePhaseManagerService } from "@/core/nutrition_care/domain/next/core/services/PatientCarePhaseManagerService";
import { GenerateUniqueId, Result, SystemCode } from "@/core/shared";
import { ICarePhaseReferenceOrchestrator } from "@/core/nutrition_care/domain/modules";
import { ICareSessionVariableGeneratorService, ICarePlanApplicatorService } from "@/core/nutrition_care/domain/next/core/services/interfaces";
import { CarePhase } from "@/core/nutrition_care/domain/next/core/models";
import { CARE_PHASE_CODES } from "@/core/constants";

jest.mock("@/core/nutrition_care/domain/next/core/models/entities/CarePhase");

describe("CarePhaseManagerService", () => {
    let idGenerator: jest.Mocked<GenerateUniqueId>;
    let carePhaseRefService: jest.Mocked<ICarePhaseReferenceOrchestrator>;
    let careSessionVariableGenerator: jest.Mocked<ICareSessionVariableGeneratorService>;
    let carePlanApplicator: jest.Mocked<ICarePlanApplicatorService>;
    let service: CarePhaseManagerService;

    beforeEach(() => {
        idGenerator = {
            generate: jest.fn().mockReturnValue({ toValue: () => "id" }),
        };
        carePhaseRefService = {
            determineApplicableCare: jest.fn(),
            evaluatePhaseStatus: jest.fn(),
            ajustOnGoingCarePlan: jest.fn(),
        };
        careSessionVariableGenerator = {
            generateIntialVariables: jest.fn(),
            generateEvaluationVariables: jest.fn(),
        };
        carePlanApplicator = {
            applyPlan: jest.fn(),
            applyAjustments: jest.fn(),
        };
        service = new CarePhaseManagerService(idGenerator, carePhaseRefService, careSessionVariableGenerator, carePlanApplicator);
        (CarePhase.create as jest.Mock).mockReturnValue(Result.ok({} as CarePhase));
    });

    it("should generate a care phase", async () => {
        // Arrange
        const carePhaseCode = SystemCode.create(CARE_PHASE_CODES.CNT_PHASE1).val;
        const patientId = "patient-id";
        careSessionVariableGenerator.generateIntialVariables.mockResolvedValue(Result.ok({}));
        carePhaseRefService.determineApplicableCare.mockResolvedValue(Result.ok({} as any));
        carePlanApplicator.applyPlan.mockResolvedValue(Result.ok(undefined));

        // Act
        const result = await service.generate(carePhaseCode, patientId);

        // Assert
        expect(result.isSuccess).toBe(true);
    });
});
