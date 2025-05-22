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
    severePos: number;
    moderatePos: number;
    median: number;
    moderateNeg: number;
    severeNeg: number;
    isUnisex: boolean;
    sex: `${Sex}`;
  }[];
}
