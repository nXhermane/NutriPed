import { AggregateID } from "@shared";

export type GetOrientationReferenceRequest = {
  orientationRefId?: AggregateID;
  orientationRefCode?: string;
};
