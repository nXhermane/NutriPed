import { DailyCareAction, DailyCareActionRepository } from "@/core/nutrition_care/domain/next/core";
import { EntityBaseRepositoryExpo } from "../../../../../shared";
import { DailyCareActionPersistenceDto } from "../../../dtos/next/core";
import { daily_care_actions } from "../../db";

export class DailyCareActionRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    DailyCareAction,
    DailyCareActionPersistenceDto,
    typeof daily_care_actions
  >
  implements DailyCareActionRepository {
}