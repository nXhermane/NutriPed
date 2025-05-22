import {
  bindEventHandler,
  DomainEventMessage,
  EventHandler,
  EventHandlerExecutionFailed,
  UseCase,
} from "@shared";
import { PatientCreatedData, PatientCreatedEvent } from "../../../patient";
import {
  CreateMedicalRecordRequest,
  CreateMedicalRecordResponse,
} from "../useCases";

@DomainEventMessage(
  "After Patient Created Event , On Medial Record BC Create a new MedicalRecord",
  true
)
export class AfterPatientCreatedMedicalHandler extends EventHandler<
  PatientCreatedData,
  PatientCreatedEvent
> {
  constructor(
    private readonly createMedicalRecordUseCase: UseCase<
      CreateMedicalRecordRequest,
      CreateMedicalRecordResponse
    >,
    priority?: number
  ) {
    super(priority);
  }
  async execute(event: PatientCreatedEvent): Promise<void> {
    await this.onPatientCreatedEvent(event.data);
  }
  private async onPatientCreatedEvent(eventData: PatientCreatedData) {
    console.log("Medical Record Event handler called");
    const result = await this.createMedicalRecordUseCase.execute({
      patientId: eventData.id,
    });
    console.log("Results ", result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (result.isLeft())
      throw new EventHandlerExecutionFailed(
        JSON.stringify((result.value as any)?.err)
      );
  }
}
bindEventHandler(AfterPatientCreatedMedicalHandler, PatientCreatedEvent);
