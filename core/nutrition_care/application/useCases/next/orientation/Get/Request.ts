import { AggregateID } from "@shared";

export interface GetOrientationReferenceRequest {
  orientationRefId?: AggregateID;
  orientationRefCode?: string;
}
