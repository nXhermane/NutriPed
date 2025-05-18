import {
  ApplicationMapper,
  Guard,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { GetMilkRequest } from "./Request";
import { GetMilkResponse } from "./Response";
import { Milk, MilkRepository } from "../../../../domain";
import { MilkDto } from "../../../dtos";

export class GetMilkUseCase
  implements UseCase<GetMilkRequest, GetMilkResponse>
{
  constructor(
    private readonly repo: MilkRepository,
    private readonly mapper: ApplicationMapper<Milk, MilkDto>
  ) {}
  async execute(request: GetMilkRequest): Promise<GetMilkResponse> {
    try {
      const milks: Milk[] = [];

      if (request.milkId && !request.milkType) {
        const milk = await this.repo.getById(request.milkId);
        milks.push(milk);
      } else if (request.milkType && !request.milkId) {
        const milk = await this.repo.getByType(request.milkType);
        milks.push(milk);
      } else {
        const allMilks = await this.repo.getAll();
        milks.push(...allMilks);
      }

      if (Guard.isEmpty(milks).succeeded) {
        return left(Result.fail("The milk not found."));
      }

      return right(Result.ok(milks.map(this.mapper.toResponse)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
