import { AppServiceResponse } from "@shared";
import { OrientationReferenceDto } from "../../../../dtos/next/orientation";

export type GetOrientationReferenceResponse = AppServiceResponse<
  OrientationReferenceDto[]
>;
