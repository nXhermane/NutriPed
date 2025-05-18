import { Medicine, MedicineRepository } from "@core/nutrition_care";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { MedicinePersistenceDto } from "../../dtos";
import { medicines } from "../db";

export class MedicineRepositoryExpoImpl extends EntityBaseRepositoryExpoWithCodeColumn<Medicine,MedicinePersistenceDto,typeof medicines> implements MedicineRepository {}