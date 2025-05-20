import { Reminder, ReminderRepository } from "@/core/reminders";
import { EntityBaseRepositoryWeb } from "../../../shared";
import { ReminderPersistenceDto } from "../dtos";
import { AggregateRoot } from "@shared";

export class ReminderRepositoryWebImpl extends EntityBaseRepositoryWeb<Reminder, ReminderPersistenceDto> implements ReminderRepository {
    async remove(reminder: Reminder): Promise<void> {
        try {
            if (!reminder.id) {
                throw new Error("Cannot remove reminder  without id");
            }

            await this.delete(reminder.id);
            if (reminder instanceof AggregateRoot) {
                const domainEvents = reminder.getDomainEvents();
                if (this.eventBus) {
                    const eventPublishingPromises = domainEvents.map(this.eventBus.publishAndDispatchImmediate);
                    await Promise.all(eventPublishingPromises);
                }
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to remove reminder: ${error}`);
        }
    }
    protected storeName: string = "reminders";


}