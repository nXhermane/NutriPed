import { AppetiteTestResult, ClinicalEvent, DailyCareJournal, MonitoringEntry, NutritionalTreatmentAction } from "@core/nutrition_care";
import { DomainDate, formatError, InfraMapToDomainError, InfrastructureMapper, Result } from "@shared";
import { DailyJournalPersistenceDto } from "../dtos";

export class DailyCareJournalInfraMapper implements InfrastructureMapper<DailyCareJournal, DailyJournalPersistenceDto> {
   toPersistence(entity: DailyCareJournal): DailyJournalPersistenceDto {
      return {
         id: entity.id as string,
         date: entity.getDate(),
         dayNumber: entity.getDayNumber(),
         appetiteTestResults: entity.getAppetiteTestResults().map((appetiteTest) => ({
            code: appetiteTest.code.unpack(),
            result: appetiteTest.result,
         })),
         monitoringValues: entity.getMonitoringValues().map((monitoringValue) => ({
            code: monitoringValue.code.unpack(),
            date: monitoringValue.date.unpack(),
            source: monitoringValue.source,
            type: monitoringValue.type,
            unit: monitoringValue.unit.unpack(),
            value: monitoringValue.value,
         })),
         observations: entity.getObservations().map((observation) => ({
            code: observation.code.unpack(),
            isPresent: observation.isPresent,
            type: observation.type,
         })),
         treatmentActions: entity.getTreatmentActions().map((action) => ({
            feedingFrequency: action.feedingFrequency,
            milkType: action.milkType,
            milkVolume: action.milkVolume,
            milkVolumeUnit: action.milkVolumeUnit.unpack(),
         })),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   toDomain(record: DailyJournalPersistenceDto): DailyCareJournal {
      const dateRes = DomainDate.create(record.date);
      const monitoringValuesRes = record.monitoringValues.map(MonitoringEntry.create);
      const observationRes = record.observations.map(ClinicalEvent.create);
      const actions = record.treatmentActions.map(NutritionalTreatmentAction.create);
      const appetiteTestsRes = record.appetiteTestResults.map(AppetiteTestResult.create);
      const combinedRes = Result.combine([dateRes, ...observationRes, ...actions, ...appetiteTestsRes, ...monitoringValuesRes]);
      if (combinedRes.isFailure) throw new InfraMapToDomainError(formatError(combinedRes, DailyCareJournalInfraMapper.name));
      return new DailyCareJournal({
         id: record.id,
         createdAt: record.createdAt,
         updatedAt: record.updatedAt,
         props: {
            date: dateRes.val,
            appetiteTestResults: appetiteTestsRes.map((r) => r.val),
            careDecisions: [],
            dayNumber: record.dayNumber,
            monitoringValues: monitoringValuesRes.map((r) => r.val),
            observations: observationRes.map((r) => r.val),
            treatmentActions: actions.map((r) => r.val),
         },
      });
   }
}
