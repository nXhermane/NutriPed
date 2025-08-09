import { AppServiceResponse } from "@shared";

// This use case does not return any data on success, just confirms completion.
export type RecordInpatientDailyProgressResponse = AppServiceResponse<void>;
