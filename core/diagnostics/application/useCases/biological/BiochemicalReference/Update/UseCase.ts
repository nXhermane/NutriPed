import { ApplicationMapper, handleError, left, Result, right, UnitCode, UseCase, ValueType } from "@shared";
import { UpdateBiochemicalReferenceRequest } from "./Request";
import { UpdateBiochemicalReferenceResponse } from "./Response";
import { BiochemicalRange, BiochemicalReference, BiochemicalReferenceRepository } from "../../../../../domain";
import { BiochemicalReferenceDto } from "../../../../dtos";

export class UpdateBiochemicalReferenceUseCase implements UseCase<UpdateBiochemicalReferenceRequest, UpdateBiochemicalReferenceResponse> {
   constructor(
      private readonly repo: BiochemicalReferenceRepository,
      private readonly mapper: ApplicationMapper<BiochemicalReference, BiochemicalReferenceDto>,
   ) {}
   async execute(request: UpdateBiochemicalReferenceRequest): Promise<UpdateBiochemicalReferenceResponse> {
      try {
         const biochemicalRef = await this.repo.getById(request.id);
         const updatedResult = this.updateBiochemicalRef(biochemicalRef, request.data);
         if (updatedResult.isFailure) return left(updatedResult);
         await this.repo.save(updatedResult);
         return right(Result.ok(this.mapper.toResponse(biochemicalRef)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   private updateBiochemicalRef(biochemicalRef: BiochemicalReference, data: UpdateBiochemicalReferenceRequest["data"]): Result<ValueType> {
      try {
         if (data.name) {
            biochemicalRef.changeName(data.name);
         }
         if (data.notes) {
            biochemicalRef.changeNotes(data.notes);
         }
         if (data.source) {
            biochemicalRef.changeSource(data.source);
         }
         if (data.unit && data.availableUnits) {
            const defaultUnit = UnitCode.create(data.unit);
            const availableUnits = data.availableUnits.map(UnitCode.create);
            const combinedRes = Result.combine([defaultUnit, ...availableUnits]);
            if (combinedRes.isFailure) return combinedRes;
            biochemicalRef.changeUnit({ defaultUnit: defaultUnit.val, availableUnits: availableUnits.map((res) => res.val) });
         }
         if (data.ranges) {
            const biochemicalRanges = data.ranges.map(BiochemicalRange.create);
            const combinedRes = Result.combine(biochemicalRanges);
            if (combinedRes.isFailure) return combinedRes;
            biochemicalRef.changeRanges(biochemicalRanges.map((res) => res.val));
         }
         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
