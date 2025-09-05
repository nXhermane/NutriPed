import { ClinicalEvent, ClinicalEventType } from "@/core/nutrition_care/domain/core/models/valueObjects/ClinicalEvent";
import { SystemCode } from "@shared";

describe("ClinicalEvent", () => {
    it("should create a new clinical event", () => {
        // Arrange
        const props = {
            code: "fever",
            type: ClinicalEventType.CLINICAL,
            isPresent: true,
        };

        // Act
        const result = ClinicalEvent.create(props);

        // Assert
        expect(result.isSuccess).toBe(true);
        const clinicalEvent = result.val;
        expect(clinicalEvent.unpack()).toEqual({
            code: SystemCode.create("fever").val,
            type: ClinicalEventType.CLINICAL,
            isPresent: true,
        });
    });

    it("should return a failure result if the code is empty", () => {
        // Arrange
        const props = {
            code: "",
            type: ClinicalEventType.CLINICAL,
            isPresent: true,
        };

        // Act
        const result = ClinicalEvent.create(props);

        // Assert
        expect(result.isFailure).toBe(true);
    });
});
