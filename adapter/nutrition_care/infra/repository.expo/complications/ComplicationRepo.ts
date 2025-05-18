import { Complication, ComplicationRepository } from "@core/nutrition_care";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { ComplicationPersistenceDto } from "../../dtos";
import { complications } from "../db";

export class ComplicationRepositoryExpoImpl extends EntityBaseRepositoryExpoWithCodeColumn<Complication,ComplicationPersistenceDto,typeof complications> implements ComplicationRepository {}