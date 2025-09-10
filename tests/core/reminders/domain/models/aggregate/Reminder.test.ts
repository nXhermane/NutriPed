import {
  Reminder,
  CreateReminderProps,
} from "@reminders/domain/models/aggregate/Reminder";
import { AggregateID, DateTime, Result } from "@shared";
import { mock, MockProxy } from "jest-mock-extended";
import {
  ReminderAction,
  ReminderTrigger,
} from "@reminders/domain/models/valueObject";
import {
  ReminderActionType,
  ReminderTriggerType,
} from "@reminders/domain/models/constants";

describe("Reminder", () => {
  let createReminderProps: CreateReminderProps;
  let mockId: MockProxy<AggregateID>;

  beforeEach(() => {
    const mockPatientId = mock<AggregateID>();
    createReminderProps = {
      title: "Test Reminder",
      message: "This is a test reminder",
      trigger: {
        type: ReminderTriggerType.DATE_TIME,
        data: {
          scheduled: {
            date: "2025-01-01",
            time: "12:00",
          },
        },
      },
      isActive: true,
      actions: [
        {
          type: ReminderActionType.CUSTOM,
          description: "Test Action",
          payload: {
            patientId: mockPatientId,
          },
        },
      ],
    };
    mockId = mock<AggregateID>();
  });

  describe("create", () => {
    it("should create a new reminder with valid props", () => {
      const reminderResult = Reminder.create(createReminderProps, mockId);
      expect(reminderResult.isSuccess).toBe(true);
      const reminder = reminderResult.val;
      expect(reminder).toBeInstanceOf(Reminder);
      expect(reminder.getTitle()).toBe("Test Reminder");
      expect(reminder.getMessage()).toBe("This is a test reminder");
      expect(reminder.getIsActive()).toBe(true);
      expect(reminder.getActions().length).toBe(1);
    });

    it("should fail to create a reminder with an empty title", () => {
      createReminderProps.title = "";
      const reminderResult = Reminder.create(createReminderProps, mockId);
      expect(reminderResult.isFailure).toBe(true);
    });
  });

  describe("entity methods", () => {
    let reminder: Reminder;

    beforeEach(() => {
      const reminderResult = Reminder.create(createReminderProps, mockId);
      if (reminderResult.isFailure) {
        throw new Error("Failed to create a valid reminder for testing");
      }
      reminder = reminderResult.val;
    });

    it("should activate the reminder", () => {
      reminder.deactivate();
      reminder.activate();
      expect(reminder.getIsActive()).toBe(true);
    });

    it("should deactivate the reminder", () => {
      reminder.activate();
      reminder.deactivate();
      expect(reminder.getIsActive()).toBe(false);
    });

    it("should update the title", () => {
      reminder.updateTitle("New Title");
      expect(reminder.getTitle()).toBe("New Title");
    });

    it("should update the message", () => {
      reminder.updateMessage("New Message");
      expect(reminder.getMessage()).toBe("New Message");
    });

    it("should update the trigger", () => {
      const newTriggerResult = ReminderTrigger.create({
        type: ReminderTriggerType.INTERVAL,
        data: {
          every: {
            value: 1,
            unit: "day",
          },
        },
      });
      if (newTriggerResult.isFailure) {
        throw new Error("Failed to create a valid trigger for testing");
      }
      reminder.updateTrigger(newTriggerResult.val);
      expect(reminder.getTrigger().type).toBe(ReminderTriggerType.INTERVAL);
    });

    it("should add an action", () => {
      const newAction = {
        type: ReminderActionType.MEDICATION,
        description: "New Action",
        payload: {
          patientId: mock<AggregateID>(),
        },
      };
      reminder.addAction(newAction);
      expect(reminder.getActions().length).toBe(2);
    });

    it("should remove an action", () => {
      const actionToRemove = reminder.getActions()[0];
      const reminderAction = new ReminderAction(actionToRemove);
      reminder.removeAction(reminderAction);
      expect(reminder.getActions().length).toBe(0);
    });

    it("should mark the reminder as triggered", () => {
      reminder.markAsTriggered();
      expect(reminder.getIsActive()).toBe(false);
    });
  });
});
