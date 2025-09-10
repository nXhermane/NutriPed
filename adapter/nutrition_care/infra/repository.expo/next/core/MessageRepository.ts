import {
  Message,
  CareMessageRepository,
} from "@/core/nutrition_care/domain/next/core";
import { EntityBaseRepositoryExpo } from "../../../../../shared";
import { MessagePersistenceDto } from "../../../dtos/next/core";
import { messages } from "../../db";
import { AggregateID } from "@/core/shared";

export class MessageRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    Message,
    MessagePersistenceDto,
    typeof messages
  >
  implements CareMessageRepository
{
  async exist(id: AggregateID): Promise<boolean> {
    return this._exist(id);
  }
}
