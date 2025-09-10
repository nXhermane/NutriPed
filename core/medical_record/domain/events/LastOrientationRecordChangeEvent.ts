import { CARE_PHASE_CODES } from "@/core/constants";
import { AggregateID, DomainEvent, DomainEventMessage } from "@/core/shared";

export interface LastOrientationRecordChangedEventData {
  patientId: AggregateID;
  data: {
    code: string;
    treatmentCode: CARE_PHASE_CODES | null;
  };
}

@DomainEventMessage(
  "The orientation record vlaue changed on medical record.",
  true
)
export class LastOrientationRecordChangedEvent extends DomainEvent<LastOrientationRecordChangedEventData> {}
