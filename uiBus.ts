import mitt, { type Emitter } from "mitt";

type UiBusEvents = {
//   "medical:update": void;
//   "nutritional:diagnostic:update": void;
};

export const uiBus: Emitter<UiBusEvents> = mitt<UiBusEvents>();
