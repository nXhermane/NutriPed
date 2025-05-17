import { DailyCareJournal, DailyCareJournalRepository } from "@core/nutrition_care";
import { EntityBaseRepository } from "../../../../shared";
import { DailyJournalPersistenceDto } from "../../dtos";



export class DailyCareJournalRepositoryWebImpl 
    extends EntityBaseRepository<DailyCareJournal, DailyJournalPersistenceDto> 
    implements DailyCareJournalRepository {
    
    protected storeName = "daily_care_journals";
}