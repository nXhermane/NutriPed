import {
    ApplicationMapper,
    handleError,
    left,
    Result,
    right,
    UseCase,
} from "@/core/shared";
import { GetCareMessageRequest } from "./Request";
import { GetCareMessageResponse } from "./Response";
import { CareMessageRepository } from "@/core/nutrition_care/domain/next/core/ports/secondary/repositories";
import { Message } from "@/core/nutrition_care/domain/next";
import { CareMessageDto } from "@/core/nutrition_care/application/dtos";

export class GetCareMessageUseCase
    implements
    UseCase<GetCareMessageRequest, GetCareMessageResponse> {
    constructor(
        private readonly careMessageRepository: CareMessageRepository,
        private readonly careMessageMapper: ApplicationMapper<Message, CareMessageDto>
    ) { }

    async execute(
        request: GetCareMessageRequest
    ): Promise<GetCareMessageResponse> {
        try {
            const message = await this.careMessageRepository.getById(request.messageId);
            const messageDto = this.careMessageMapper.toResponse(message);

            return right(Result.ok(messageDto));
        } catch (e: unknown) {
            return left(handleError(e));
        }
    }
}
