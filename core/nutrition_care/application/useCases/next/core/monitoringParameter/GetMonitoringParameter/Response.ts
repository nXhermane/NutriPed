import { Either, ExceptionBase, Result } from "@/core/shared";
import { NextCoreDtos } from "@/core/nutrition_care/application/dtos";
export type GetMonitoringParameterResponse = Either<
  ExceptionBase | unknown,
  Result<NextCoreDtos.MonitoringParameterDto>
>;
