import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
  SystemCode,
  Guard,
} from "@shared";
import { GetMilkRequest } from "./Request";
import { GetMilkResponse } from "./Response";
import { MilkDto } from "@/core/nutrition_care/application/dtos/next/milk";
import { NextNutritionCare } from "@/core/nutrition_care/domain";

export class GetMilkUseCase
  implements UseCase<GetMilkRequest, GetMilkResponse>
{
  constructor(
    private readonly repo: NextNutritionCare.MilkRepository,
    private readonly mapper: ApplicationMapper<NextNutritionCare.Milk, MilkDto>
  ) {}
  async execute(request: GetMilkRequest): Promise<GetMilkResponse> {
    try {
      const milks = [];
      if(request.code && !request.id) {
        const codeRes = SystemCode.create(request.code);
        if(codeRes.isFailure) {
          return left(codeRes);
        }
        const milk = await this.repo.getByCode(codeRes.val);
        milks.push(milk);
      }else if (request.id && !request.code) {
        const milk = await this.repo.getById(request.id);
        milks.push(milk);
      }else {
        milks.push(...await this.repo.getAll());
      }
      if(Guard.isEmpty(milks).succeeded) {
        return left(Result.fail("The milks not found."));
      }
      return right(
        Result.ok(milks.map(milk => this.mapper.toResponse(milk)))
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
