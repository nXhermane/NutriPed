import {
  APPETITE_TEST_PRODUCT_TYPE,
  DATA_FIELD_CODE_TYPE,
} from "@/core/constants";
import { AggregateID, DomainEvent, DomainEventMessage } from "@/core/shared";
import {
  DataFieldResponseValue,
  TakenAmountInSachet,
  TakenAmountOfPot,
} from "../models/entities";

export interface LastAppetiteTestRecordChangedEventData {
  patientId: AggregateID;
  data: {
    amount: TakenAmountInSachet | TakenAmountOfPot;
    productType: APPETITE_TEST_PRODUCT_TYPE;
    fieldResponse: Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue>;
  };
}
@DomainEventMessage("The appetite test value changed on medical record.", true)
export class LastAppetiteTestRecordChangedEvent extends DomainEvent<LastAppetiteTestRecordChangedEventData> {}
