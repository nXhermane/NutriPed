import { handleError, left, Result, right, UseCase } from "@shared";
import { EvaluateAppetiteRequest } from "./Request";
import { EvaluateAppetiteResponse } from "./Response";
import { AppetiteTestData, IAppetiteTestService } from "../../../../domain";

export class EvaluateAppetiteUseCase
  implements UseCase<EvaluateAppetiteRequest, EvaluateAppetiteResponse>
{
  constructor(private readonly appetiteTestService: IAppetiteTestService) {}
  async execute(
    request: EvaluateAppetiteRequest
  ): Promise<EvaluateAppetiteResponse> {
    try {
      const appetiteTestDataResult = AppetiteTestData.create(request);
      if (appetiteTestDataResult.isFailure) {
        return left(appetiteTestDataResult);
      }

      const data = appetiteTestDataResult.val;
      const testResult = await this.appetiteTestService.test(data);
      if (testResult.isFailure) {
        return left(testResult);
      }

      const { code, result: appetiteTestResult } = testResult.val.unpack();
      return right(
        Result.ok({
          code: code.unpack(),
          result: appetiteTestResult,
        })
      );
    } catch (error) {
      return left(handleError(error));
    }
  }
}
