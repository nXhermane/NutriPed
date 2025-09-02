import {
  CreateOrientation,
  Orient,
} from "../../../../useCases/next/orientation";
import { OrientationReferenceDto } from "../../../../dtos/next/orientation";
import { Result } from "@/core/shared";
import { OrientationResultDto } from "../../../../dtos/next/orientation/OrientationResultDto";

export interface IOrientationAppService {
  getOrientations(): Promise<Result<OrientationReferenceDto[]>>;
  createOrientation(
    request: CreateOrientation.Request
  ): Promise<Result<OrientationReferenceDto>>;
  orient(request: Orient.Request): Promise<Result<OrientationResultDto>>;
}
