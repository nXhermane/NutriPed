import {
    ArgumentNotProvidedException,
    DateTime,
    Duration,
    formatError,
    Guard,
    handleError,
    IDateTime,
    IDuration,
    Result,
    Time,
    ValueObject,
} from "@shared"
import { RECURRING_FREQUENCY, ReminderTriggerType, Weekday } from "../constants"

type IntervalTrigger = {
    type: ReminderTriggerType.INTERVAL
    data: { every: Duration }
}

type DateTimeTrigger = {
    type: ReminderTriggerType.DATE_TIME
    data: { scheduled: DateTime }
}

type RecurringTrigger = {
    type: ReminderTriggerType.RECURRING
    data: {
        frequency: RECURRING_FREQUENCY
        time: Time
        daysOfWeek?: Weekday[]
    }
}
export type SerializedReminderTrigger =
    | { type: ReminderTriggerType.INTERVAL; every: number }
    | { type: ReminderTriggerType.DATE_TIME; scheduled: string }
    | { type: ReminderTriggerType.RECURRING; frequency: RECURRING_FREQUENCY; time: string; daysOfWeek?: Weekday[] }

export type IReminderTriggerProps = IntervalTrigger | DateTimeTrigger | RecurringTrigger

export type ReminderTriggerInputData = {
    [ReminderTriggerType.INTERVAL]: { every: IDuration }
    [ReminderTriggerType.DATE_TIME]: { scheduled: IDateTime }
    [ReminderTriggerType.RECURRING]: {
        frequency: RECURRING_FREQUENCY
        time: string // HH:mm format
        daysOfWeek?: Weekday[]
    }
}

export interface CreateReminderTriggerProps {
    type: ReminderTriggerType
    data: ReminderTriggerInputData[ReminderTriggerType]
}

export class ReminderTrigger extends ValueObject<IReminderTriggerProps> {

    protected validate(props: Readonly<IReminderTriggerProps>): void {
        if (Guard.isEmpty(props.data).succeeded) {
            throw new ArgumentNotProvidedException("Reminder trigger data cannot be empty.")
        }

        switch (props.type) {
            case ReminderTriggerType.INTERVAL:
                if (!("every" in props.data)) {
                    throw new ArgumentNotProvidedException("Missing 'every' in INTERVAL trigger.")
                }
                break

            case ReminderTriggerType.DATE_TIME:
                if (!("scheduled" in props.data)) {
                    throw new ArgumentNotProvidedException("Missing 'scheduled' in DATE_TIME trigger.")
                }
                break

            case ReminderTriggerType.RECURRING:
                const { frequency, time, daysOfWeek } = props.data
                if (!frequency || !time) {
                    throw new ArgumentNotProvidedException("Missing 'frequency' or 'time' in RECURRING trigger.")
                }
                if (frequency === RECURRING_FREQUENCY.WEEKLY && !daysOfWeek) {
                    throw new ArgumentNotProvidedException("'daysOfWeek' is required for WEEKLY triggers.")
                }
                break
        }
    }

    // Type guards
    isIntervalTrigger(): this is ValueObject<IntervalTrigger> {
        return this.props.type === ReminderTriggerType.INTERVAL
    }

    isDateTimeTrigger(): this is ValueObject<DateTimeTrigger> {
        return this.props.type === ReminderTriggerType.DATE_TIME
    }

    isRecurringTrigger(): this is ValueObject<RecurringTrigger> {
        return this.props.type === ReminderTriggerType.RECURRING
    }

    // Static factory
    static create(props: CreateReminderTriggerProps): Result<ReminderTrigger> {
        try {
            let data: IReminderTriggerProps["data"]

            switch (props.type) {
                case ReminderTriggerType.INTERVAL: {
                    const { every } = props.data as ReminderTriggerInputData[ReminderTriggerType.INTERVAL]
                    const durationRes = Duration.create(every)
                    if (durationRes.isFailure) {
                        return Result.fail(formatError(durationRes, ReminderTrigger.name))
                    }
                    data = { every: durationRes.val }
                    break
                }

                case ReminderTriggerType.DATE_TIME: {
                    const { scheduled } = props.data as ReminderTriggerInputData[ReminderTriggerType.DATE_TIME]
                    const dateTimeRes = DateTime.create(scheduled)
                    if (dateTimeRes.isFailure) {
                        return Result.fail(formatError(dateTimeRes, ReminderTrigger.name))
                    }
                    data = { scheduled: dateTimeRes.val }
                    break
                }

                case ReminderTriggerType.RECURRING: {
                    const { frequency, time, daysOfWeek } = props.data as ReminderTriggerInputData[ReminderTriggerType.RECURRING]
                    const timeRes = Time.create(time)
                    if (timeRes.isFailure) {
                        return Result.fail(formatError(timeRes, ReminderTrigger.name))
                    }
                    data = { frequency, time: timeRes.val, daysOfWeek }
                    break
                }

                default:
                    return Result.fail("Invalid ReminderTrigger type.")
            }

            return Result.ok(new ReminderTrigger({ type: props.type, data } as IReminderTriggerProps))
        } catch (e) {
            return handleError(e)
        }
    }

    public serialize(): SerializedReminderTrigger {
        switch (this.props.type) {
            case ReminderTriggerType.INTERVAL:
                return {
                    type: ReminderTriggerType.INTERVAL,
                    every: this.props.data.every.toSeconds(),  // D en secondes
                }

            case ReminderTriggerType.DATE_TIME:
                return {
                    type: ReminderTriggerType.DATE_TIME,
                    scheduled: this.props.data.scheduled.toDate().toISOString(), // D ISO string
                }

            case ReminderTriggerType.RECURRING:
                return {
                    type: ReminderTriggerType.RECURRING,
                    frequency: this.props.data.frequency,
                    time: this.props.data.time.time, // Time en string format HH:mm
                    daysOfWeek: this.props.data.daysOfWeek,
                }
            default:
                throw new Error("Unsupported ReminderTrigger type during serialization")
        }
    }

}
