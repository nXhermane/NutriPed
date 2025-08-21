import {
  APPETITE_TEST_PRODUCT_TYPE,
  APPETITE_TEST_SACHET_FRACTION_PARTITION,
  DATA_FIELD_CODE_TYPE,
} from "@core/constants";
import { EntityPersistenceDto } from "../../../../shared";

export interface AppetiteTestReferencePersistenceDto
  extends EntityPersistenceDto {
  name: string;
  code: string;
  productType: APPETITE_TEST_PRODUCT_TYPE[];
  appetiteTestTable: {
    weightRange: [number, number];
    sachetRange: [
      APPETITE_TEST_SACHET_FRACTION_PARTITION,
      APPETITE_TEST_SACHET_FRACTION_PARTITION,
    ];
    potRange: [number, number];
  }[];
  neededDataFields: { code: DATA_FIELD_CODE_TYPE, require: boolean }[];
}
