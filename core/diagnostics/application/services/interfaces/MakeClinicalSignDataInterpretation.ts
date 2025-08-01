import { AppServiceResponse, Message } from "@/core/shared";
import { MakeClinicalSignDataInterpretationRequest } from "../../useCases";

export interface IMakeClinicalSignDataInterpretationService {
    interpret(req: MakeClinicalSignDataInterpretationRequest): Promise<AppServiceResponse<{ code: string, isPresent: boolean }[]> | Message>
}