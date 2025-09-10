import { DailyCareJournal } from "@/core/nutrition_care/domain/core/models/entities/DailyCareJournal";
import {
  MonitoringEntry,
  ClinicalEvent,
  NutritionalTreatmentAction,
} from "@/core/nutrition_care/domain/core/models/valueObjects";
import { DateManager, DomainDate } from "@shared";

describe("DailyCareJournal", () => {
  const today = DateManager.formatDate(new Date());

  it("should create a new daily care journal", () => {
    // Arrange
    const id = "journal-id";

    // Act
    const result = DailyCareJournal.create(today, id);

    // Assert
    expect(result.isSuccess).toBe(true);
    const journal = result.val;
    expect(journal.id).toBe(id);
    expect(journal.getDayNumber()).toBe(0);
  });

  it("should add a monitoring value", () => {
    // Arrange
    const journal = DailyCareJournal.create(today, "journal-id").val;
    const monitoringEntry = MonitoringEntry.create({
      date: today,
      type: "anthropometric" as any,
      code: "weight",
      value: 10,
      unit: "kg",
      source: "manual" as any,
    }).val;

    // Act
    journal.addMonitoringValue(monitoringEntry);

    // Assert
    expect(journal.getMonitoringValues()).toContainEqual(
      monitoringEntry.unpack()
    );
  });

  it("should add a treatment action", () => {
    // Arrange
    const journal = DailyCareJournal.create(today, "journal-id").val;
    const action = NutritionalTreatmentAction.create({
      milkType: "f75" as any,
      milkVolume: 100,
      milkVolumeUnit: "ml",
      feedingFrequency: 8,
    }).val;

    // Act
    journal.addAction(action);

    // Assert
    expect(journal.getTreatmentActions()).toContainEqual(action.unpack());
  });

  it("should add a clinical event", () => {
    // Arrange
    const journal = DailyCareJournal.create(today, "journal-id").val;
    const clinicalEvent = ClinicalEvent.create({
      code: "fever",
      type: "clinical" as any,
      isPresent: true,
    }).val;

    // Act
    journal.addClinicalEvent(clinicalEvent);

    // Assert
    expect(journal.getObservations()).toContainEqual(clinicalEvent.unpack());
  });
});
