import { Inspectable } from "./preview";

export type BlockProps = Inspectable;

export type Block<B = {}> = B & BlockProps;
