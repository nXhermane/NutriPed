import {
  UseCase,
  Result,
  AppServiceResponse,
  handleError,
} from "@shared";
import { IPatientCareSessionRepository } from "../../../../domain/core/ports/secondary/IPatientCareSessionRepository";
import { RecordInpatientDailyProgressRequest } from "./Request";
import { RecordInpatientDailyProgressResponse } from "./Response";
import { IPatientDailyJournalGenerator } from "../../../../domain/core/ports/primary";
import {
  RepositoryNotFoundError,
  DomainDate,
  MonitoredValueSource,
} from "@shared";
import {
  ClinicalEvent,
  MonitoringEntry,
} from "../../../../domain/core/models/valueObjects";

export class RecordInpatientDailyProgressUseCase extends UseCase<
  RecordInpatientDailyProgressRequest,
  RecordInpatientDailyProgressResponse
> {
  constructor(
    private readonly patientCareSessionRepository: IPatientCareSessionRepository,
    private readonly patientDailyJournalGenerator: IPatientDailyJournalGenerator
  ) {
    super();
  }

  public async execute(
    request: RecordInpatientDailyProgressRequest
  ): Promise<RecordInpatientDailyProgressResponse> {
    try {
      // 1. Load the PatientCareSession
      const session = await this.patientCareSessionRepository.findById(
        request.patientCareSessionId
      );
      if (!session) {
        return Result.fail(
          new RepositoryNotFoundError(
            "PatientCareSession",
            request.patientCareSessionId
          )
        );
      }

      // 2. Ensure a daily journal for the date exists
      const journalRes =
        this.patientDailyJournalGenerator.createDailyJournalIfNeeded(session);
      if (journalRes.isFailure) {
        return Result.fail(journalRes.error);
      }

      // 3. Add all monitoring entries
      for (const entry of request.monitoringEntries) {
        const monitoringEntry = MonitoringEntry.create({
          ...entry,
          source: MonitoredValueSource.MANUAL, // Assuming manual entry
        }).val;
        session.addMonitoringValueToJournal(monitoringEntry);
      }

      // 4. Add all clinical events
      for (const event of request.clinicalEvents) {
        const clinicalEvent = ClinicalEvent.create(event).val;
        session.addClinicalEventToJournal(clinicalEvent);
      }

      // 5. TODO: Add administered actions (e.g., milk, medicine)
      // This requires designing a suitable value object.

      // 6. Save the updated session
      await this.patientCareSessionRepository.save(session);

      // 7. Return a success result
      return Result.ok<void>();
    } catch (e) {
      return handleError(e);
    }
  }
}
