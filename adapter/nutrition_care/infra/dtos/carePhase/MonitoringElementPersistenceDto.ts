import {
  MONITORING_ELEMENT_CATEGORY,
  MONITORING_VALUE_SOURCE,
  AnthroSystemCodes,
  BIOCHEMICAL_REF_CODES,
  DATA_FIELD_CODE_TYPE,
  CLINICAL_SIGNS,
} from "@/core/constants";
import {
  IDuration,
  IFrequency,
} from "@/core/nutrition_care/domain/modules/carePhase/models/valueObjects";
import { EntityPersistenceDto } from "../../../../shared";
import { ValueOf } from "@/utils";

export type MONITORING_CODE_TYPE =
  | AnthroSystemCodes
  | ValueOf<typeof BIOCHEMICAL_REF_CODES>
  | DATA_FIELD_CODE_TYPE
  | ValueOf<typeof CLINICAL_SIGNS>;

export interface MonitoringElementPersistenceDto extends EntityPersistenceDto {
  category: MONITORING_ELEMENT_CATEGORY;
  source: MONITORING_VALUE_SOURCE;
  code: MONITORING_CODE_TYPE;
  frequency: IFrequency;
  duration: IDuration;
}
