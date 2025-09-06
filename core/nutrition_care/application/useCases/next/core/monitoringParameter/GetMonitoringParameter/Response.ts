import { Either, ExceptionBase, Result } from "@/core/shared";
import { MonitoringParameterDto } from "@/core/nutrition_care/application/dtos";

export type GetMonitoringParameterResponse = Either<
  ExceptionBase | unknown,
  Result<MonitoringParameterDto>
>;
