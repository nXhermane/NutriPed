import { OnGoingTreatment, OnGoingTreatmentRepository } from "@/core/nutrition_care/domain/next/core";
import { EntityBaseRepositoryExpo } from "../../../../../shared";
import { OnGoingTreatmentPersistenceDto } from "../../../dtos/next/core";
import { on_going_treatments } from "../../db";
import { AggregateID } from "@/core/shared";

export class OnGoingTreatmentRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    OnGoingTreatment,
    OnGoingTreatmentPersistenceDto,
    typeof on_going_treatments
  >
  implements OnGoingTreatmentRepository
{
  

  async exist(id: AggregateID): Promise<boolean> {
    return this._exist(id);
  }
}