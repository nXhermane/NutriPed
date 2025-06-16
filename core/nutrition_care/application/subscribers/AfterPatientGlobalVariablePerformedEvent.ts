import {
  bindEventHandler,
  DomainEventMessage,
  EventHandler,
} from "domain-eventrix";
import {
  PatientGlobalVariablePerformedEventData,
  PatientGlobalVariablesPerformedEvent,
} from "../../../diagnostics/application/events";
import {
  ConditionResult,
  DomainDate,
  EventHandlerExecutionFailed,
  formatError,
  UseCase,
} from "@shared";
import {
  AddDataToPatientCareSessionRequest,
  AddDataToPatientCareSessionResponse,
  MakePatientCareSessionReadyRequest,
  MakePatientCareSessionReadyResponse,
} from "../useCases";
import {
  ClinicalEventType,
  CreateClinicalEvent,
  CreateMonitoringEntry,
  MonitoredValueSource,
  MonitoringEntryType,
} from "../../domain";
//BETA:
@DomainEventMessage(
  "After patient global variable performed event: update patient care session with new variables",
  true
)
export class AfterPatientGlobalVariablePerformedEvent extends EventHandler<
  PatientGlobalVariablePerformedEventData,
  PatientGlobalVariablesPerformedEvent
> {
  constructor(
    private readonly addDataUseCase: UseCase<
      AddDataToPatientCareSessionRequest,
      AddDataToPatientCareSessionResponse
    >,
    private readonly makeReadyUseCase: UseCase<
      MakePatientCareSessionReadyRequest,
      MakePatientCareSessionReadyResponse
    >,
    priority?: number
  ) {
    super(priority);
  }

  async execute(event: PatientGlobalVariablesPerformedEvent): Promise<void> {
    await this.onPatientGlobalVariablePerformed(event.data);
  }

  async onPatientGlobalVariablePerformed(
    data: PatientGlobalVariablePerformedEventData
  ): Promise<void> {
    const { patientId, variables } = data;

    const addRequest: AddDataToPatientCareSessionRequest = {
      patientOrPatientCareId: patientId,
      clinicalEvents: this.generateClinicalEvents(
        variables.clinicalVariablesObjects
      ),
      monitoringValues: this.generateMonitoringValues(variables),
    };

    const addResponse = await this.addDataUseCase.execute(addRequest);
    if (addResponse.isRight()) {
      const result = await this.makeReadyUseCase.execute({
        patientIdOrPatientCareId: patientId,
      });
      if (result.isRight()) {
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = (addResponse.value as any).err;
        console.error(AfterPatientGlobalVariablePerformedEvent.name, error);
        throw new EventHandlerExecutionFailed(
          formatError(error, AfterPatientGlobalVariablePerformedEvent.name)
        );
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = (addResponse.value as any).err;
      console.error(AfterPatientGlobalVariablePerformedEvent.name, error);
      throw new EventHandlerExecutionFailed(
        formatError(error, AfterPatientGlobalVariablePerformedEvent.name)
      );
    }
  }

  private generateClinicalEvents(
    clinicalVariablesObjects: Record<string, number>
  ): CreateClinicalEvent[] {
    return Object.entries(clinicalVariablesObjects).map(([code, result]) => ({
      code,
      isPresent: result === ConditionResult.True,
      type: ClinicalEventType.CLINICAL,
    }));
  }

  private generateMonitoringValues(
    variables: PatientGlobalVariablePerformedEventData["variables"]
  ): CreateMonitoringEntry[] {
    console.log(
      "This is called on ",
      AfterPatientGlobalVariablePerformedEvent.name
    );
    const date: string = new DomainDate().unpack(); // Assumes unpack() returns a string representation of the date.
    const defaultUnit = "kg"; // FIXME: adjust unit mapping as needed.

    const biologicalEntries: CreateMonitoringEntry[] = Object.entries(
      variables.biologicalVariablesObjects
    ).map(([code, value]) => ({
      code,
      value,
      date,
      source: MonitoredValueSource.IMPORTED,
      type: MonitoringEntryType.BIOCHEMICAL,
      unit: defaultUnit,
    }));

    const anthropometricEntries: CreateMonitoringEntry[] = Object.entries(
      variables.anthropometricVariableObjects
    ).map(([code, value]) => ({
      code,
      value: value as never,
      date,
      source: MonitoredValueSource.IMPORTED,
      type: MonitoringEntryType.ANTHROPOMETRIC,
      unit: defaultUnit,
    }));

    return [...biologicalEntries, ...anthropometricEntries];
  }
}

bindEventHandler(
  AfterPatientGlobalVariablePerformedEvent,
  PatientGlobalVariablesPerformedEvent
);
