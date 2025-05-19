// FIX: fix this after the next build. After the next dev build the app can't support a crypto module.
import { nanoid } from "nanoid/non-secure";
import { EntityUniqueID, GenerateUniqueId } from "@shared";

export class GenerateUUID implements GenerateUniqueId {
  generate(): EntityUniqueID {
    return new EntityUniqueID(nanoid());
  }
}
