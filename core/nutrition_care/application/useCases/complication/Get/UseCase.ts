import { UseCase, Result, left, handleError, ApplicationMapper, right } from "@shared";
import { Complication, ComplicationRepository } from "../../../../domain";
import { GetComplicationRequest } from "./Request";
import { GetComplicationResponse } from "./Response";
import { ComplicationDto } from "../../../dtos";

export class GetComplicationUseCase implements UseCase<GetComplicationRequest, GetComplicationResponse> {
   constructor(
      private readonly complicationRepository: ComplicationRepository,
      private readonly complicationMapper: ApplicationMapper<Complication, ComplicationDto>,
   ) {}

   async execute(request: GetComplicationRequest): Promise<GetComplicationResponse> {
      try {
         const complications: Complication[] = [];

         if (request.complicationId) {
            const complication = await this.complicationRepository.getById(request.complicationId);
            complications.push(complication);
         } else {
            const allComplications = await this.complicationRepository.getAll();
            complications.push(...allComplications);
         }
         if (complications.length === 0) {
            return left(Result.fail("Complication not found"));
         }
         return right(Result.ok(complications.map(this.complicationMapper.toResponse)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
