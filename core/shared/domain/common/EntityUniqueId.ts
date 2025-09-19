import { Identifier } from "./Identifier";
export class EntityUniqueID extends Identifier<string | number> {
  constructor(id: string | number) {
    super(id);
  }
}
