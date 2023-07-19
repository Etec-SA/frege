import { BinaryOperation } from "./binary-operation"

export interface Disjunction extends BinaryOperation {
    readonly operation: 'Disjunction'
}