import { Formula } from '../formulas/formula';

export interface BinaryOperation {
  right: Formula;
  left: Formula;
}

export interface Biconditional extends BinaryOperation {
  readonly operation: 'Biconditional';
}

export interface Conjunction extends BinaryOperation {
  readonly operation: 'Conjunction';
}

export interface Disjunction extends BinaryOperation {
  readonly operation: 'Disjunction';
}

export interface Implication extends BinaryOperation {
  readonly operation: 'Implication';
}
