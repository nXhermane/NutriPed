import {
  ClinicalSignDataAddedEvent,
  ClinicalSignDataAddedEventData,
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
  "After Clinical Sign Added to Medical Record, add it to patient diagnostic data.",
  true
)
export class AfterClinicalSignDataAddedDiagnosticHandler extends EventHandler<
  ClinicalSignDataAddedEventData,
  ClinicalSignDataAddedEvent
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

  async execute(event: ClinicalSignDataAddedEvent): Promise<void> {
    await this.onClinicalSignAdded(event.data);
  }
  private async onClinicalSignAdded(
    eventData: ClinicalSignDataAddedEventData
  ): Promise<void> {
    const result = await this.updatePatientDiagnosticData.execute({
      patientOrNutritionalDiagnosticId: eventData.patientId,
      patientDiagnosticData: {
        clinicalData: {
          clinicalSigns: [
            { code: eventData.data.code, data: eventData.data.data },
          ],
        },
      },
    });
    if (result.isRight()) {
      console.debug("Add Clinical Sign to Patient Diagnostic Succeed.");
    } else {
      const error = (result.value as any).err;
      throw new EventHandlerExecutionFailed(
        formatError(error, AfterClinicalSignDataAddedDiagnosticHandler.name)
      );
    }
  }
}

bindEventHandler(
  AfterClinicalSignDataAddedDiagnosticHandler,
  ClinicalSignDataAddedEvent
);
