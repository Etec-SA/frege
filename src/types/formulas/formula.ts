import { PropositionalVariable } from '../operations/propositional-variable';
import { Negation } from '../operations/unary-operation';
import {
  Conjunction,
  Disjunction,
  Implication,
  Biconditional,
} from '../operations/binary-operations';

/**
   * Represents a generic logical formula.
   */
export type Formula =
  | PropositionalVariable
  | Negation
  | Conjunction
  | Disjunction
  | Implication
  | Biconditional;
