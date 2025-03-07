import { Inspectable } from "./preview";

export type BlockProps = Inspectable;

export type Block<B = object> = B & BlockProps;
