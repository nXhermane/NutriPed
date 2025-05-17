import { ApplicationMapper } from "@shared";
import { DailyCareJournal } from "../../domain";
import { DailyCareJournalDto } from "../dtos";

export class DailyCareJournalMapper implements ApplicationMapper<DailyCareJournal, DailyCareJournalDto> {
   toResponse(entity: DailyCareJournal): DailyCareJournalDto {
      return {
         id: entity.id,
         date: entity.getDate(),
         dayNumber: entity.getDayNumber(),
         appetiteTestResults: entity.getAppetiteTestResults().map((valObj) => ({ code: valObj.code.unpack(), result: valObj.result })),
         observations: entity.getObservations().map((valObj) => ({ code: valObj.code.unpack(), isPresent: valObj.isPresent, type: valObj.type })),
         monitoringValues: entity
            .getMonitoringValues()
            .map((valObj) => ({ ...valObj, date: valObj.date.unpack(), code: valObj.code.unpack(), unit: valObj.unit.unpack() })),
         treatmentActions: entity.getTreatmentActions().map((valObj) => ({
            feedingFrequency: valObj.feedingFrequency,
            milkType: valObj.milkType,
            milkVolume: valObj.milkVolume,
            milkVolumeUnit: valObj.milkVolumeUnit.unpack(),
         })),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
