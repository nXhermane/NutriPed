import { Result } from "@shared";
import { AppetiteTestData, AppetiteTestResult } from "../../../models";

export interface IAppetiteTestService {
  test(data: AppetiteTestData): Promise<Result<AppetiteTestResult>>;
}
