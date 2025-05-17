import { ApplicationMapper, handleError, left, Result, right, SystemCode, UseCase } from "@shared";
import { GetAppetiteTestRequest } from "./Request";
import { GetAppetiteTestResponse } from "./Response";
import { AppetiteTestRef, AppetiteTestRefRepository } from "../../../../domain";
import { AppetiteTestRefDto } from "../../../dtos";

export class GetAppetiteTestUseCase implements UseCase<GetAppetiteTestRequest, GetAppetiteTestResponse> {
   constructor(private readonly repo: AppetiteTestRefRepository, private readonly mapper: ApplicationMapper<AppetiteTestRef, AppetiteTestRefDto>) {}
   async execute(request: GetAppetiteTestRequest): Promise<GetAppetiteTestResponse> {
      try {
         const { appetiteTestId, appetiteTestCode } = request;

         // Ensure exactly one identifier is provided
         if (Boolean(appetiteTestId) === Boolean(appetiteTestCode)) {
            return left(Result.fail("You must provide exactly one of appetiteTestId or appetiteTestCode"));
         }

         let appetiteTestRef: AppetiteTestRef;
         // If appetiteTestId is provided, fetch by ID; otherwise, fetch by code
         if (appetiteTestId) {
            appetiteTestRef = await this.repo.getById(appetiteTestId);
         } else {
            const codeResult = SystemCode.create(appetiteTestCode!);
            if (codeResult.isFailure) {
               return left(codeResult);
            }
            appetiteTestRef = await this.repo.getByCode(codeResult.val);
         }

         return right(Result.ok(this.mapper.toResponse(appetiteTestRef)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
