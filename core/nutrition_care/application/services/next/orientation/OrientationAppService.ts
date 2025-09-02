import {
  CreateUseCase,
  GetUseCase,
  OrientUseCase,
  CreateOrientation,
  Orient,
} from "../../../useCases/next/orientation";
import { IOrientationAppService } from "./interfaces";
import { Result } from "@/core/shared";
import { OrientationReferenceDto } from "../../../dtos/next/orientation";
import { OrientationResultDto } from "../../../dtos/next/orientation/OrientationResultDto";

export class OrientationAppService implements IOrientationAppService {
  constructor(
    private readonly getUseCase: GetUseCase,
    private readonly createUseCase: CreateUseCase,
    private readonly orientUseCase: OrientUseCase
  ) {}

  getOrientations(): Promise<Result<OrientationReferenceDto[]>> {
    return this.getUseCase.execute();
  }

  createOrientation(
    request: CreateOrientation.Request
  ): Promise<Result<OrientationReferenceDto>> {
    return this.createUseCase.execute(request);
  }

  orient(request: Orient.Request): Promise<Result<OrientationResultDto>> {
    return this.orientUseCase.execute(request);
  }
}
