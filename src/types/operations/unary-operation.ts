import { Formula } from '../formulas/formula';

export interface UnaryOperation {
  value: Formula;
}

export interface Negation extends UnaryOperation {
  readonly operation: 'Negation';
}
