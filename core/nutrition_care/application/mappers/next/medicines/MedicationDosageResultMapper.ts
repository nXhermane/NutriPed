import { ApplicationMapper } from "@/core/shared";
import { MedicationDosageResult } from "../../../../domain/modules/next/medicines/models/valueObjects";
import { MedicationDosageResultDto } from "../../../dtos/next/medicines/MedicationDosageResultDto";

export class MedicationDosageResultMapper
  implements
    ApplicationMapper<MedicationDosageResult, MedicationDosageResultDto>
{
  toResponse(entity: MedicationDosageResult): MedicationDosageResultDto {
    const unpacked = entity.unpack();
    return {
      dailyDosage: unpacked.dailyDosage,
      dailyFrequency: unpacked.dailyFrequency,
      dosage: unpacked.dosage.unpack(),
    };
  }
}
