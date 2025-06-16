import {
  formatError,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { AddDataToPatientCareSessionRequest } from "./Request";
import { AddDataToPatientCareSessionResponse } from "./Response";
import {
  ClinicalEvent,
  IPatientDailyJournalGenerator,
  MonitoringEntry,
  PatientCareSession,
  PatientCareSessionRepository,
} from "../../../../../domain";

export class AddDataToPatientCareSessionUseCase
  implements
    UseCase<
      AddDataToPatientCareSessionRequest,
      AddDataToPatientCareSessionResponse
    >
{
  constructor(
    private readonly repo: PatientCareSessionRepository,
    private readonly dailyGenerator: IPatientDailyJournalGenerator
  ) {}

  async execute(
    request: AddDataToPatientCareSessionRequest
  ): Promise<AddDataToPatientCareSessionResponse> {
    try {
      const patientCareSession = await this.repo.getByIdOrPatientId(
        request.patientOrPatientCareId
      );
      const result =
        this.dailyGenerator.createDailyJournalIfNeeded(patientCareSession);
      if (result.isFailure) return left(result);

      const addRes = this.addDataToPatientCareSession(
        patientCareSession,
        request
      );
      if (addRes.isFailure) return left(addRes);

      await this.repo.save(patientCareSession);

      return right(Result.ok());
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
  private addDataToPatientCareSession(
    patientCareSession: PatientCareSession,
    request: AddDataToPatientCareSessionRequest
  ): Result<void> {
    try {
      const monitoringValuesRes = this.createMonitoringValues(
        request.monitoringValues
      );
      if (monitoringValuesRes.isFailure)
        return monitoringValuesRes as unknown as Result<void>;

      const clinicalEventsRes = this.createClinicalEvents(
        request.clinicalEvents
      );
      if (clinicalEventsRes.isFailure)
        return clinicalEventsRes as unknown as Result<void>;
      monitoringValuesRes.val.map(monitoringEntry =>
        patientCareSession.addMonitoringValueToJournal(monitoringEntry)
      );
      clinicalEventsRes.val.map(clinicalEvent =>
        patientCareSession.addClinicalEventToJournal(clinicalEvent)
      );

      return Result.ok();
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private createMonitoringValues(
    monitoringValues: AddDataToPatientCareSessionRequest["monitoringValues"]
  ): Result<MonitoringEntry[]> {
    const monitoringValuesRes = monitoringValues.map(MonitoringEntry.create);
    const combinedRes = Result.combine(monitoringValuesRes);
    if (combinedRes.isFailure)
      return Result.fail(
        formatError(combinedRes, AddDataToPatientCareSessionUseCase.name)
      );
    return Result.ok(monitoringValuesRes.map(res => res.val));
  }
  private createClinicalEvents(
    clinicalEvents: AddDataToPatientCareSessionRequest["clinicalEvents"]
  ): Result<ClinicalEvent[]> {
    const clinicalEventsRes = clinicalEvents.map(ClinicalEvent.create);
    const combinedRes = Result.combine(clinicalEventsRes);
    if (combinedRes.isFailure)
      return Result.fail(
        formatError(combinedRes, AddDataToPatientCareSessionUseCase.name)
      );
    return Result.ok(clinicalEventsRes.map(res => res.val));
  }
}
