import { GrowthStandard } from "@/core/constants";
import { TableData } from "./TableData";

export interface GrowthReferenceTableProps {
  code: string;
  name: string;
  standard: GrowthStandard;
  data: TableData[];
}
