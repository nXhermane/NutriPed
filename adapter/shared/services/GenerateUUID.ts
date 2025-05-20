import { nanoid } from "nanoid";
import { EntityUniqueID, GenerateUniqueId } from "@shared";

export class GenerateUUID implements GenerateUniqueId {
  generate(): EntityUniqueID {
    return new EntityUniqueID(nanoid());
  }
}
