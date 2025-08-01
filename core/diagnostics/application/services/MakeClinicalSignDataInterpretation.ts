import { AppServiceResponse, Message, UseCase } from "@/core/shared";
import { MakeClinicalSignDataInterpretationRequest, MakeClinicalSignDataInterpretationResponse } from "../useCases";
import { IMakeClinicalSignDataInterpretationService } from "./interfaces";

export interface MakeClinicalSignDataInterpretationUseCases {
    interpretUC: UseCase<MakeClinicalSignDataInterpretationRequest, MakeClinicalSignDataInterpretationResponse>
}

export class MakeClinicalSignDataInterpretationService implements IMakeClinicalSignDataInterpretationService {
    constructor(private readonly ucs: MakeClinicalSignDataInterpretationUseCases) {

    }
    async interpret(req: MakeClinicalSignDataInterpretationRequest): Promise<AppServiceResponse<{ code: string; isPresent: boolean; }[]> | Message> {
        const res = await this.ucs.interpretUC.execute(req);
        if (res.isRight()) return { data: res.value.val };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        else return new Message("error", JSON.stringify((res.value as any)?.err));
    }

}