import {
  PatientCareSessionCreatedData,
  PatientCareSessionCreatedEvent,
} from "../../../nutrition_care";
import {
  DomainEventMessage,
  EventHandler,
  UseCase,
  IEventBus,
  EventHandlerExecutionFailed,
  formatError,
} from "@shared";
import {
  PerformPatientGlobalVariableRequest,
  PerformPatientGlobalVariableResponse,
} from "../useCases";
import { PatientGlobalVariablesPerformedEvent } from "../events";
import { bindEventHandler } from "domain-eventrix";

@DomainEventMessage(
  "After Patient Care Session Created, Start patient current State Computing.",
  true
)
export class AfterPatientCareSessionCreatedHandler extends EventHandler<
  PatientCareSessionCreatedData,
  PatientCareSessionCreatedEvent
> {
  constructor(
    private readonly performGlobalVariableUseCase: UseCase<
      PerformPatientGlobalVariableRequest,
      PerformPatientGlobalVariableResponse
    >,
    private readonly eventBus: IEventBus,
    priority?: number
  ) {
    super(priority);
  }

  async execute(event: PatientCareSessionCreatedEvent): Promise<void> {
    await this.handlePatientCareSessionCreated(event.data);
  }

  private async handlePatientCareSessionCreated(
    data: PatientCareSessionCreatedData
  ): Promise<void> {
    const result = await this.performGlobalVariableUseCase.execute({
      patientId: data.patientId,
    });
    if (result.isRight()) {
      const globalVariables = result.value.val;
      const globalEvent = new PatientGlobalVariablesPerformedEvent({
        patientId: data.patientId,
        variables: globalVariables,
      });
      await this.eventBus.publishAndDispatchImmediate(globalEvent);
    } else {
      const error = (result.value as any).err;
      console.error(AfterPatientCareSessionCreatedHandler.name, error);
      throw new EventHandlerExecutionFailed(
        formatError(error, AfterPatientCareSessionCreatedHandler.name)
      );
    }
  }
}

bindEventHandler(
  AfterPatientCareSessionCreatedHandler,
  PatientCareSessionCreatedEvent
);
