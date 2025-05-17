import { AggregateID } from "@shared";
import { APPETITE_TEST_PRODUCT_TYPE } from "../../../domain/modules";
import { APPETITE_TEST_SACHET_FRACTION_PARTITION } from "../../../../constants";

export interface AppetiteTestRefDto {
   id: AggregateID;
   name: string;
   code: string;
   productType: APPETITE_TEST_PRODUCT_TYPE[];
   appetiteTestTable: {
      weightRange: [number, number];
      sachetRange: [APPETITE_TEST_SACHET_FRACTION_PARTITION, APPETITE_TEST_SACHET_FRACTION_PARTITION];
      potRange: [number, number];
   }[];
   createdAt: string;
   updatedAt: string;
}
