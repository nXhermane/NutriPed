import { GrowthStandard } from "@core/constants";
import { Sex } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";

export interface GrowthReferenceTablePersistenceDto
  extends EntityPersistenceDto {
  name: string;
  code: string;
  standard: `${GrowthStandard}`;
  data: {
    value: number;
    median: number;
    normalNeg: number;
    moderateNeg: number;
    hightSeverNeg: number;
    outComeTargetValueNeg: number;
    severeNeg: number;
    isUnisex: boolean;
    sex: `${Sex}`;
  }[];
}
