import { DailyCareJournal, DailyCareJournalRepository } from "@core/nutrition_care";
import { EntityBaseRepositoryWeb } from "../../../../shared";
import { DailyJournalPersistenceDto } from "../../dtos";



export class DailyCareJournalRepositoryWebImpl 
    extends EntityBaseRepositoryWeb<DailyCareJournal, DailyJournalPersistenceDto> 
    implements DailyCareJournalRepository {
    
    protected storeName = "daily_care_journals";
}