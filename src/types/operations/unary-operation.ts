import { Formula } from '../formulas/formula';

export interface UnaryOperation {
  operation: string;
  value: Formula;
}

export interface Negation extends UnaryOperation {
  readonly operation: 'Negation';
}
