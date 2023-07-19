import { UnaryOperation } from "./unary-operation"

export interface Negation extends UnaryOperation {
    readonly operation: 'Negation'
}