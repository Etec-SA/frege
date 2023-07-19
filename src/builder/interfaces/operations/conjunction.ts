import { BinaryOperation } from "./binary-operation"

export interface Conjunction extends BinaryOperation {
    readonly operation: 'Conjunction'
}  