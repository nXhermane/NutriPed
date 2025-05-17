import { EntityUniqueID } from "./EntityUniqueId";

export interface GenerateUniqueId {
    generate(): EntityUniqueID
}