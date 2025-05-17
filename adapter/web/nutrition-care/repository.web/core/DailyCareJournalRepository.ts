
import { DailyCareJournal, DailyCareJournalRepository } from "@core/nutrition_care";
import { EntityBaseRepository } from "../../../common";
import { DailyJournalPersistenceDto } from "../../mappers";


export class DailyCareJournalRepositoryImpl 
    extends EntityBaseRepository<DailyCareJournal, DailyJournalPersistenceDto> 
    implements DailyCareJournalRepository {
    
    protected storeName = "daily_care_journals";
}