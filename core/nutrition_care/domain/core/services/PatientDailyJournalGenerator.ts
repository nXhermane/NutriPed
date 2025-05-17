import { formatError, GenerateUniqueId, handleError, Result } from "@shared";
import { DailyCareJournal, PatientCareSession } from "../models";
import { IPatientDailyJournalGenerator } from "../ports/primary";

export class PatientDailyJournalGenerator implements IPatientDailyJournalGenerator {
   constructor(private readonly idGenerator: GenerateUniqueId) {}
   createDailyJournalIfNeeded(patientCareSession: PatientCareSession): Result<void> {
      try {
         if (!patientCareSession.haveCurrentDailyJournal()) {
            const newId = this.idGenerator.generate().toValue();
            const dailyJournalRes = DailyCareJournal.create(patientCareSession.getStartDate(), newId);
            if (dailyJournalRes.isFailure) {
               return Result.fail(formatError(dailyJournalRes, PatientDailyJournalGenerator.name));
            }
            const currentDailyJournal = dailyJournalRes.val;
            patientCareSession.addDailyJournal(currentDailyJournal);
         }
         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
