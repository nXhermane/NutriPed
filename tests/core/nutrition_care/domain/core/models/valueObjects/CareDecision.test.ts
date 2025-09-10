import { CareDecision } from "@/core/nutrition_care/domain/core/models/valueObjects/CareDecision";

describe("CareDecision", () => {
  it("should create a new care decision", () => {
    // Arrange
    const props = { notes: ["Test note"] };

    // Act
    const careDecision = new CareDecision(props);

    // Assert
    expect(careDecision).toBeInstanceOf(CareDecision);
    expect(careDecision.unpack()).toEqual(props);
  });
});
