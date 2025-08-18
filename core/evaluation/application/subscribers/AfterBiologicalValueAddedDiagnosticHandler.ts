import {
  LastBiologicalValueChangedEvent,
  LastBiologicalValueChangedEventData,
  LastClinicalSignDataChangedEvent,
  LastClinicalSignDataChangedEventData,
} from "../../../medical_record";
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
  "After BiologicalValue Added to Medical Record, add it to patient diagnostic data.",
  true
)
export class AfterBiologicalValueAddedDiagnosticHandler extends EventHandler<
  LastBiologicalValueChangedEventData,
  LastBiologicalValueChangedEvent
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

  async execute(event: LastBiologicalValueChangedEvent): Promise<void> {
    await this.onBiologicalValueAdded(event.data);
  }
  private async onBiologicalValueAdded(
    eventData: LastBiologicalValueChangedEventData
  ): Promise<void> {
    const result = await this.updatePatientDiagnosticData.execute({
      patientOrNutritionalDiagnosticId: eventData.patientId,
      patientDiagnosticData: {
        biologicalTestResults: [
          {
            code: eventData.data.code,
            unit: eventData.data.unit,
            value: eventData.data.value,
          },
        ],
      },
    });
    if (result.isRight()) {
      console.debug("Add BiologicalValue to Patient Diagnostic Succeed.");
    } else {
      const error = (result.value as any).err;
      throw new EventHandlerExecutionFailed(
        formatError(error, AfterBiologicalValueAddedDiagnosticHandler.name)
      );
    }
  }
}

bindEventHandler(
  AfterBiologicalValueAddedDiagnosticHandler,
  LastClinicalSignDataChangedEvent
);
