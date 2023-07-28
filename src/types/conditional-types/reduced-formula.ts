import {
  Biconditional,
  BinaryOperation,
  Conjunction,
  Disjunction,
  Implication,
} from '../operations/binary-operations';
import { Negation } from '../operations/unary-operation';

export type ReducedFormula<T extends string | (BinaryOperation | Negation)> =
  T extends string
    ? string
    : T extends Implication
    ? Disjunction
    : T extends Biconditional
    ? Conjunction
    : T extends Conjunction
    ? Conjunction
    : T extends Disjunction
    ? Disjunction
    : T extends Negation
    ? Negation
    : never;
