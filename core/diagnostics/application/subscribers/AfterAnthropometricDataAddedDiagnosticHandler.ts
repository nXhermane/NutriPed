import {
  AnthropometricDataAddedEvent,
  AnthropometricDataAddedEventData,
} from "./../../../medical_record";
import {
  bindEventHandler,
  DomainEventMessage,
  EventHandler,
  EventHandlerExecutionFailed,
  formatError,
  UseCase,
} from "@shared";
import {
  UpdatePatientDiagnosticDataRequest,
  UpdatePatientDiagnosticDataResponse,
} from "../useCases";

@DomainEventMessage(
  "After Anthropometric Data Added to Medical Record, add it to patient diagnostic data.",
  true
)
export class AfterAnthropometricDataAddedDiagnosticHandler extends EventHandler<
  AnthropometricDataAddedEventData,
  AnthropometricDataAddedEvent
> {
  constructor(
    private readonly updatePatientDiagnosticData: UseCase<
      UpdatePatientDiagnosticDataRequest,
      UpdatePatientDiagnosticDataResponse
    >,
    priority?: number
  ) {
    super(priority);
  }

  async execute(event: AnthropometricDataAddedEvent): Promise<void> {
    await this.onAnthropometricDataAdded(event.data);
  }

  private async onAnthropometricDataAdded(
    eventData: AnthropometricDataAddedEventData
  ): Promise<void> {
    const result = await this.updatePatientDiagnosticData.execute({
      patientOrNutritionalDiagnosticId: eventData.patientId,
      patientDiagnosticData: {
        anthropometricData: {
          data: [
            {
              code: eventData.data.code,
              unit: eventData.data.unit,
              value: eventData.data.value,
            },
          ],
        },
      },
    });
    if (result.isRight()) {
      console.debug("Add Anthropometric Data to Patient Diagnostic Succeed.");
    } else {
      const error = (result.value as any).err;
      console.error(AfterAnthropometricDataAddedDiagnosticHandler.name, error);
      throw new EventHandlerExecutionFailed(
        formatError(error, AfterAnthropometricDataAddedDiagnosticHandler.name)
      );
    }
  }
}

bindEventHandler(
  AfterAnthropometricDataAddedDiagnosticHandler,
  AnthropometricDataAddedEvent
);
