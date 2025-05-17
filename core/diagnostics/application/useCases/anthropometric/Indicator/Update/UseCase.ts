import { ApplicationMapper, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { UpdateIndicatorRequest } from "./Request";
import { UpdateIndicatorResponse } from "./Response";
import { AvailableChart, Condition, Formula, Indicator, IndicatorInterpreter, IndicatorRepository } from "../../../../../domain";
import { IndicatorDto } from "../../../../dtos";

export class UpdateIndicatorUseCase implements UseCase<UpdateIndicatorRequest, UpdateIndicatorResponse> {
   constructor(private readonly repo: IndicatorRepository, private readonly mapper: ApplicationMapper<Indicator, IndicatorDto>) {}
   async execute(request: UpdateIndicatorRequest): Promise<UpdateIndicatorResponse> {
      try {
         const indicator = await this.repo.getById(request.id);
         const updatedRes = this.updateIndicator(indicator, request.data);
         if (updatedRes.isFailure) return left(updatedRes);
         await this.repo.save(indicator);
         return right(Result.ok(this.mapper.toResponse(indicator)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   private updateIndicator(indicator: Indicator, data: UpdateIndicatorRequest["data"]): Result<unknown> {
      try {
         if (data.name) {
            indicator.changeName(data.name);
         }
         if (data.neededMeasureCodes) {
            const systemCodes = data.neededMeasureCodes.map(SystemCode.create);
            const combinedRes = Result.combine(systemCodes);
            if (combinedRes.isFailure) return combinedRes;
            indicator.changeNeededMeasureCodes(systemCodes.map((res) => res.val));
         }
         if (data.zScoreComputingStrategy) {
            indicator.changeZScoreComputingStrategyType(data.zScoreComputingStrategy);
         }
         if (data.availableRefCharts) {
            const availableRefCharts = data.availableRefCharts.map(AvailableChart.create);
            const combinedRes = Result.combine(availableRefCharts);
            if (combinedRes.isFailure) return combinedRes;
            indicator.changeAvailableCharts(availableRefCharts.map((res) => res.val));
         }
         if (data.usageConditions) {
            const usageCondition = Condition.create(data.usageConditions);
            if (usageCondition.isFailure) return usageCondition;
            indicator.changeUsageCondition(usageCondition.val);
         }
         if (data.interpretations) {
            const interpretations = data.interpretations.map(IndicatorInterpreter.create);
            const combinedRes = Result.combine(interpretations);
            if (combinedRes.isFailure) return combinedRes;
            indicator.changeInterpretations(interpretations.map((res) => res.val));
         }
         if (data.axeY && data.axeX) {
            const axeY = Formula.create(data.axeY);
            const axeX = Formula.create(data.axeX);
            const combinedRes = Result.combine([axeY, axeX]);
            if (combinedRes.isFailure) return combinedRes;
            indicator.changeAxe({ axeX: axeX.val, axeY: axeY.val });
         }
         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
