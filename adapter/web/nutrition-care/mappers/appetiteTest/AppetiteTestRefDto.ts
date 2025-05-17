import { APPETITE_TEST_SACHET_FRACTION_PARTITION } from "@core/constants";
import { APPETITE_TEST_PRODUCT_TYPE } from "@core/nutrition_care";
import { EntityPersistenceDto } from "../../../common";

export interface AppetiteTestReferencePersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   productType: APPETITE_TEST_PRODUCT_TYPE[];
   appetiteTestTable: {
      weightRange: [number, number];
      sachetRange: [APPETITE_TEST_SACHET_FRACTION_PARTITION, APPETITE_TEST_SACHET_FRACTION_PARTITION];
      potRange: [number, number];
   }[];
}
