import { GrowthReferenceChart, GrowthReferenceChartRepository } from "@core/diagnostics";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { GrowthReferenceChartPersistenceDto } from "../../dtos";
import { growth_reference_charts } from "../db";

export class GrowthReferenceChartRepositoryExpoImpl extends EntityBaseRepositoryExpoWithCodeColumn<GrowthReferenceChart,GrowthReferenceChartPersistenceDto,typeof growth_reference_charts> implements GrowthReferenceChartRepository {
 
    
}