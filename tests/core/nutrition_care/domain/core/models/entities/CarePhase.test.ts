import { CarePhase } from "@/core/nutrition_care/domain/core/models/entities/CarePhase";

describe("CarePhase", () => {
  it("should create a new care phase", () => {
    // Arrange
    const props = { name: "Test Phase" };
    const id = "test-id";

    // Act
    const result = CarePhase.create(props, id);

    // Assert
    expect(result.isSuccess).toBe(true);
    const carePhase = result.val;
    expect(carePhase.props.name).toBe("Test Phase");
    expect(carePhase.id).toBe("test-id");
  });

  it("should return a failure result if the name is empty", () => {
    // Arrange
    const props = { name: "" };
    const id = "test-id";

    // Act
    const result = CarePhase.create(props, id);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain("CarePhase name can't be empty.");
  });
});
