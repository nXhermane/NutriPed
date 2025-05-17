import { AggregateID, AppServiceResponse, Message } from "@shared";
import { ConvertUnitRequest, CreateUnitRequest, DeleteUnitRequest, GetUnitRequest, UpdateUnitRequest } from "../../useCases";
import { UnitDto } from "../../dtos";

export interface IUnitService {
   create(req: CreateUnitRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
   get(req: GetUnitRequest): Promise<AppServiceResponse<UnitDto[]> | Message>;
   update(req: UpdateUnitRequest): Promise<AppServiceResponse<boolean> | Message>;
   delete(req: DeleteUnitRequest): Promise<AppServiceResponse<boolean> | Message>;
   convert(req: ConvertUnitRequest): Promise<AppServiceResponse<{ code: string; value: number }> | Message>;
}
