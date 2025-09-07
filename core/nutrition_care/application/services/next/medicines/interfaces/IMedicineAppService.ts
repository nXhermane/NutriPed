import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreateMedicineRequest,
  GetMedicineRequest,
  GetMedicineDosageRequest,
} from "../../../../useCases/next/medicines";
import { NextMedicinesDto } from "@/core/nutrition_care/application/dtos";


export interface IMedicineAppService {
  create(
    req: CreateMedicineRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetMedicineRequest
  ): Promise<AppServiceResponse<NextMedicinesDto.MedicineDto[]> | Message>;
  getDosage(
    req: GetMedicineDosageRequest
  ): Promise<AppServiceResponse<NextMedicinesDto.MedicationDosageResultDto> | Message>;
}
