import { DataFieldResponseDto } from "./../../../../../dtos"
import { Sex } from "@/core/shared"


export type MakeClinicalEvaluationRequest = {
    data: DataFieldResponseDto[]
    context: {
        birthday: string
        sex: Sex
    }
}