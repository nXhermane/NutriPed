import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared/repository.expo";
import { MedicinePersistenceDto } from "../../../dtos/next/medicines/MedicinePersistenceDto";
import { next_medicines } from "../../db/nutrition_care.schema";
import { NextNutritionCare } from "@/core/nutrition_care";

export class MedicineRepositoryExpo
  extends EntityBaseRepositoryExpoWithCodeColumn<
    NextNutritionCare.Medicine,
    MedicinePersistenceDto,
    typeof next_medicines
  >
  implements NextNutritionCare.MedicineRepository {}
