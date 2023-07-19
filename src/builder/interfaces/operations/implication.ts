import { BinaryOperation } from "./binary-operation";

export interface Implication extends BinaryOperation {
    readonly operation: 'Implication'
}