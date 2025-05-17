import { Repository, SystemCode } from "@shared";
import { Complication } from "../../../models";

export interface ComplicationRepository extends Repository<Complication> {
   getAll(): Promise<Complication[]>;
   exist(code: SystemCode): Promise<boolean>;
}
