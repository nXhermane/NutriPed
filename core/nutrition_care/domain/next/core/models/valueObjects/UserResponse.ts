import { AggregateID, DomainDateTime, EmptyStringError, formatError, Guard, handleError, Result, ValueObject } from "@/core/shared";
export enum UserDecisionAction {
    COMPLETE_ITEMS = 'COMPLETE_ITEMS',
    MARK_INCOMPLETE = "MARK_INCOMPLETE",
    COMPLETE_ALL = "COMPLETE_ALL"
}
export enum UserDecisionType {
    COMPLETION_RESPONSE = "COMPLETION_RESPONSE",
    PHASE_TRANSITION = "PHASE_TRANSITION",
    TREATMENT_ADJUSTMENT = "TREATMENT_ADJUSTMENT",
    VARIABLE_PROVISION = "VARIABLE_PROVISION"
}
export enum UserDecisionItemType {
    ACTION ='action',
    TASK = 'task'
}
export type UserDecisionData = {
    type: UserDecisionType;
    action: UserDecisionAction;
    items: { id: AggregateID, type:UserDecisionItemType }[];
}
export interface IUserResponse {
    messageId: AggregateID;
    response: string;
    timestamp: DomainDateTime;
    decisionData:UserDecisionData
}

export interface CreateUserRespone {
    messageId: AggregateID;
    response: string;
    timestamp?: string;
    decisionData?: UserDecisionData
}

export class UserResponse extends ValueObject<IUserResponse> {
    getMessageId(): AggregateID {
        return this.props.messageId;
    }
    getResponse(): string {
        return this.props.response;
    }
    getTimestamp(): string {
        return this.props.timestamp.unpack()
    }
    getDecisionData(): UserDecisionData {
        return this.props.decisionData;
    }
    protected validate(props: Readonly<IUserResponse>): void {
        if (Guard.isEmpty(props.response).succeeded) {
            throw new EmptyStringError("The user response message can't be empty.")
        }
    }
    static create(createProps: CreateUserRespone): Result<UserResponse> {
        try {
            const timestampRes = DomainDateTime.create(createProps.timestamp)
            if (timestampRes.isFailure) {
                return Result.fail(formatError(timestampRes, UserResponse.name));
            }
            return Result.ok(new UserResponse({
                messageId: createProps.messageId,
                response: createProps.response,
                timestamp: timestampRes.val,
                decisionData: createProps.decisionData || {} as UserDecisionData,
            }))
        } catch (e) {
            return handleError(e);
        }
    }
}