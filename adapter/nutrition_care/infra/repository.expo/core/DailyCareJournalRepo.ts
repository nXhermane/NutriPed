import {
  DailyCareJournal,
  DailyCareJournalRepository,
} from "@core/nutrition_care";
import { EntityBaseRepositoryExpo } from "../../../../shared";
import { DailyJournalPersistenceDto } from "../../dtos";
import { daily_care_journals } from "../db";

export class DailyCareJournalRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    DailyCareJournal,
    DailyJournalPersistenceDto,
    typeof daily_care_journals
  >
  implements DailyCareJournalRepository {}
