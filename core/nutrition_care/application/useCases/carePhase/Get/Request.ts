import { CARE_PHASE_CODES } from "@/core/constants";
import { AggregateID } from "@/core/shared";

export type GetCarePhaseReferenceRequest = {
    code?: CARE_PHASE_CODES;
    id?: AggregateID;
}
