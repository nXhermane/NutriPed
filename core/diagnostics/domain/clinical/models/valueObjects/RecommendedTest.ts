import { EmptyStringError, Guard, handleError, Result, ValueObject } from "@shared"

export interface IRecommendedTest {
    testName: string
    reason: string
}
export class RecommendedTest extends ValueObject<IRecommendedTest> {
    protected validate(props: Readonly<IRecommendedTest>): void {
        if (Guard.isEmpty(props.testName).succeeded) throw new EmptyStringError("The testName of RecommendedTest can't be empty.")
        if (Guard.isEmpty(props.reason).succeeded) throw new EmptyStringError("The reason for suggestion of this Test can't be empty.")
    }

    static create(props: IRecommendedTest): Result<RecommendedTest> {
        try {
            return Result.ok(new RecommendedTest(props))
        } catch (e: unknown) {
            return handleError(e)
        }
    }

}